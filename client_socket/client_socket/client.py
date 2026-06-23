import json
import time
import ctypes
import queue
import threading
import requests
from ctypes import c_int, c_char_p, CFUNCTYPE
from datetime import datetime

class EasyTestHttpClient:
    def __init__(self, server_base_url):
        self.server_url = server_base_url.rstrip('/')
        self.device_connected = False
        self.connection_in_progress = False

        # --- 1. ROBUSTNESS: Initialize Queue and Threading ---
        self.event_queue = queue.Queue()
        self.session = requests.Session() 
        self.running = True
        
        # Start the background worker thread (Daemon ensures it dies when main app dies)
        self.worker_thread = threading.Thread(target=self._worker_loop, daemon=True)
        self.worker_thread.start()
        print("🧵 Network Worker Thread Started")

        # --- 2. DLL Loading ---
        possible_paths = [
            "./resources/EasyTestSDK_x64.dll",
            "../resources/EasyTestSDK_x64.dll",
            "../../resources/EasyTestSDK_x64.dll",
            "./EasyTestSDK_x64.dll",
            "../EasyTestSDK_x64.dll"
        ]

        self.lib = None
        for path in possible_paths:
            try:
                self.lib = ctypes.CDLL(path)
                print(f"✅ Found EasyTest SDK at: {path}")
                break
            except OSError:
                continue

        if self.lib is None:
            raise FileNotFoundError("EasyTestSDK_x64.dll not found in any expected location")

        self._setup_callbacks()
        self._define_functions()
        self._register_callbacks()

        # Initialize SDK
        self.lib.License(1, b"SUNARS2013")
        self.lib.SetLogOn(0)

    # --- 3. WORKER THREAD (Consumes Queue) ---
    def _worker_loop(self):
        """
        This runs in the background. It takes events from the queue 
        and sends them to the server. This prevents the DLL from blocking.
        """
        while self.running:
            try:
                # Wait for an event (timeout allows us to check self.running occasionally)
                endpoint, data = self.event_queue.get(timeout=1.0)
                self._send_http_request(endpoint, data)
                self.event_queue.task_done()
            except queue.Empty:
                continue
            except Exception as e:
                print(f"⚠️ Worker Thread Error: {e}")

    # --- 4. NETWORK LOGIC (Runs in Worker Thread) ---
    def _send_http_request(self, endpoint, data):
        url = f"{self.server_url}/api/{endpoint}/create/"
        try:
            # Short timeout to prevent backlog if server is slow
            response = self.session.post(url, json=data, timeout=3)
            
            if response.status_code == 201:
                # Success - print less noise for key events
                if endpoint != 'key-events':
                    print(f"✅ Posted to {endpoint}")
            else:
                print(f"❌ Failed to post {endpoint}: {response.status_code} {response.text}")
                
        except Exception as e:
            print(f"❌ Network Error ({endpoint}): {e}")

    # --- 5. DLL CONFIGURATION (Standard) ---
    def _setup_callbacks(self):
        self._connect_cb = CFUNCTYPE(None, c_int, c_int, c_char_p)(self._on_connect)
        self._vote_cb = CFUNCTYPE(None, c_int, c_int, c_char_p)(self._on_vote)
        self._key_cb = CFUNCTYPE(None, c_int, c_int, c_char_p, c_int, ctypes.c_float, c_char_p)(self._on_key)
        self._hd_cb = CFUNCTYPE(None, c_int, c_int, c_char_p)(self._on_hd_param)
        self._keypad_cb = CFUNCTYPE(None, c_int, c_int, c_char_p, c_int, c_char_p)(self._on_keypad_param)

    def _define_functions(self):
        self.lib.License.argtypes = [c_int, c_char_p]
        self.lib.License.restype = c_int

        self.lib.Connect.argtypes = [c_int, c_char_p]
        self.lib.Connect.restype = c_int

        self.lib.Disconnect.argtypes = [c_int]
        self.lib.Disconnect.restype = c_int

        self.lib.VoteStart2.argtypes = [c_int, c_int, c_char_p]
        self.lib.VoteStart2.restype = c_int

        self.lib.VoteStop2.argtypes = [c_int]
        self.lib.VoteStop2.restype = c_int

        self.lib.SetLogOn.argtypes = [c_int]
        self.lib.SetLogOn.restype = c_int

        self.lib.SetConnectEventCallBack.argtypes = [type(self._connect_cb)]
        self.lib.SetHDParamEventCallBack.argtypes = [type(self._hd_cb)]
        self.lib.SetKeypadParamEventCallBack.argtypes = [type(self._keypad_cb)]
        self.lib.SetVoteEventCallBack.argtypes = [type(self._vote_cb)]
        self.lib.SetKeyEventCallBack.argtypes = [type(self._key_cb)]

    def _register_callbacks(self):
        self.lib.SetConnectEventCallBack(self._connect_cb)
        self.lib.SetVoteEventCallBack(self._vote_cb)
        self.lib.SetKeyEventCallBack(self._key_cb)
        self.lib.SetHDParamEventCallBack(self._hd_cb)
        self.lib.SetKeypadParamEventCallBack(self._keypad_cb)

    # --- 6. CALLBACKS (Updated to be Non-Blocking) ---
    def _on_connect(self, base_id, mode, info):
        info_str = info.decode() if info else ""
        print(f"🔌 SDK: Device Connect BaseID={base_id}, Mode={mode}, Info={info_str}")

        if info_str == "1":
            self.device_connected = True
            print("🚀 SDK: Auto-starting vote session...")
            self.start_vote(base_id, 10, "1,1,0,0,4,1")
        else:
            self.device_connected = False

        # Put in queue
        event = {
            'base_id': base_id,
            'mode': mode,
            'info': info_str,
            'timestamp': datetime.now().isoformat(),
        }
        self.event_queue.put(('connect-events', event))

    def _on_vote(self, base_id, mode, info):
        info_str = info.decode() if info else ""
        print(f"🗳️ SDK: Vote Event BaseID={base_id}, Mode={mode}")

        event = {
            'base_id': base_id,
            'mode': mode,
            'info': info_str,
            'timestamp': datetime.now().isoformat(),
        }
        self.event_queue.put(('vote-events', event))

    def _on_key(self, base_id, key_id, key_sn, mode, timestamp, info):
        # 1. Decode strings quickly
        key_sn_str = key_sn.decode() if key_sn else ""
        info_str = info.decode() if info else ""
        
        # 2. Print local log (optional, can comment out for speed)
        # print(f"🔑 SDK: Key Event KeyID={key_id}, Info={info_str}")

        # 3. Construct Payload
        event = {
            'base_id': base_id,
            'key_id': key_id,
            'key_sn': key_sn_str if key_sn_str else "unknown",
            'mode': mode,
            'timestamp': datetime.now().isoformat(),
            'info': info_str,
            'client_timestamp': datetime.now().isoformat(),
            'event_type': 'real_hardware',
        }
        
        # 4. INSTANTLY push to queue. 
        # The DLL can now return and handle the next student immediately.
        self.event_queue.put(('key-events', event))

    def _on_hd_param(self, base_id, mode, info):
        info_str = info.decode() if info else ""
        event = {
            'base_id': base_id,
            'mode': mode,
            'info': info_str,
            'timestamp': datetime.now().isoformat(),
        }
        self.event_queue.put(('hd-param-events', event))

    def _on_keypad_param(self, base_id, key_id, key_sn, mode, info):
        key_sn_str = key_sn.decode() if key_sn else ""
        info_str = info.decode() if info else ""
        event = {
            'base_id': base_id,
            'key_id': key_id,
            'key_sn': key_sn_str,
            'mode': mode,
            'info': info_str,
            'timestamp': datetime.now().isoformat(),
        }
        self.event_queue.put(('keypad-param-events', event))

    # --- 7. PUBLIC METHODS ---
    def connect_device(self, conn_type=2, conn_str=""):
        if self.connection_in_progress or self.device_connected:
            print("⚠️ Connection already in progress or device already connected")
            return 0
        self.connection_in_progress = True

        print(f"🔌 Connecting to device (type={conn_type})...")
        result = self.lib.Connect(conn_type, conn_str.encode())
        if result == 0:
            print("✅ Device connection initiated")
        else:
            print(f"❌ Device connection failed with code: {result}")
            self.connection_in_progress = False
        return result

    def disconnect_device(self, base_id=0):
        self.running = False # Tell worker thread to stop
        return self.lib.Disconnect(base_id)

    def start_vote(self, base_id=0, vote_type=10, config="1,1,0,0,4,1"):
        return self.lib.VoteStart2(base_id, vote_type, config.encode())

    def stop_vote(self, base_id=0):
        return self.lib.VoteStop2(base_id)

def main():
    SERVER_BASE = "http://127.0.0.1:8000"  # Ensure this matches your Django port
    print("🚀 Starting EasyTest Robust HTTP Client...")
    client = EasyTestHttpClient(SERVER_BASE)

    try:
        print("🔌 Connecting to EasyTest device...")
        # 2 = UDP/Network, 1 = USB
        result = client.connect_device(conn_type=2, conn_str="")
        
        if result != 0:
            print("🔄 Network auto-discovery failed, trying USB...")
            result = client.connect_device(conn_type=1, conn_str="")

        if result != 0:
            print("❌ Hardware connection failed! Check power/drivers.")
        else:
            print("⏳ Device connected. Awaiting SDK events (Ctrl+C to stop)...")

        # Main thread just keeps the script alive
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n🛑 Shutting down client...")

    finally:
        client.disconnect_device()
        print("🪜 Cleanup done.")

if __name__ == "__main__":
    main()