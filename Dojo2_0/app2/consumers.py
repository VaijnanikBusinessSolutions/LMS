import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Group, GroupMessage

User = get_user_model()

class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Called when the WebSocket is handshaking as part of the connection process.
        """
        # 1. Get the Group ID from the URL route
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.room_group_name = f'chat_{self.group_id}'

        # 2. Join the Room (Group)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # 3. Accept the connection
        await self.accept()
        print(f"✅ WebSocket Connected: {self.room_group_name}")

    async def disconnect(self, close_code):
        """
        Called when the WebSocket closes for any reason.
        """
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"❌ WebSocket Disconnected: {self.room_group_name}")

    async def receive(self, text_data):
        """
        Called when we receive a text frame from the client (Frontend).
        """
        try:
            # 1. Parse incoming JSON
            data = json.loads(text_data)
            
            # 2. Extract data safely
            message_content = data.get('message')
            user_id = data.get('user_id')

            # 3. Validation
            if not message_content or not user_id:
                print("⚠️ Ignored message with missing content or user_id")
                return

            # 4. Save message to Database and get formatted sender info
            saved_message = await self.save_message(user_id, self.group_id, message_content)

            # 5. Broadcast message to everyone in the room
            if saved_message:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': saved_message
                    }
                )
        except json.JSONDecodeError:
            print("⚠️ Failed to decode JSON")
        except Exception as e:
            print(f"❌ Error in receive: {e}")

    async def chat_message(self, event):
        """
        Called when a message is received from the room group.
        Sends the message back to the WebSocket (Frontend).
        """
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def save_message(self, user_id, group_id, content):
        """
        Saves the message to the DB and returns a dictionary 
        formatted for the frontend (including Role/Avatar logic).
        """
        try:
            # 1. Fetch User and Group
            user = User.objects.get(id=user_id)
            group = Group.objects.get(id=group_id)
            
            # 2. Create the Database Record
            msg = GroupMessage.objects.create(sender=user, group=group, content=content)
            
            # 3. Determine User Details (Name, Role, Avatar)
            # This logic handles both LMS Profiles and raw Users (Admins)
            
            sender_name = user.email
            role = "employee" # Default role
            avatar = None

            # --- LOGIC A: If User is Admin/Superuser ---
            if user.is_staff or user.is_superuser:
                sender_name = "Administrator"
                if user.first_name:
                    sender_name = f"{user.first_name} {user.last_name}"
                role = "team-leader" # Give admins the 'Admin' badge in UI
                
                # Check for direct profile image on User model
                if hasattr(user, 'profile_image') and user.profile_image:
                    avatar = user.profile_image.url

            # --- LOGIC B: If User has an LMS Profile (Standard logic) ---
            elif hasattr(user, 'lms_profile'):
                sender_name = f"{user.lms_profile.firstName} {user.lms_profile.lastName}"
                role = user.lms_profile.userType
                if user.lms_profile.profileImage:
                    avatar = user.lms_profile.profileImage.url
            
            # --- LOGIC C: Fallback to User Model fields ---
            else:
                if user.first_name:
                    sender_name = f"{user.first_name} {user.last_name}"
                # Check for direct role on User model (app1)
                if hasattr(user, 'role') and user.role:
                    role = user.role.name
                # Check for direct profile image on User model (app1)
                if hasattr(user, 'profile_image') and user.profile_image:
                    avatar = user.profile_image.url

            # 4. Return the formatted data
            return {
                'id': msg.id,
                'content': msg.content,
                'sender': user.id,
                'sender_name': sender_name,
                'sender_role': role,
                'sender_avatar': avatar,
                'timestamp': str(msg.timestamp)
            }

        except User.DoesNotExist:
            print(f"❌ User {user_id} not found")
            return None
        except Group.DoesNotExist:
            print(f"❌ Group {group_id} not found")
            return None
        except Exception as e:
            print(f"❌ DB Error saving message: {e}")
            return None