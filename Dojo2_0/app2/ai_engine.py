import google.generativeai as genai
import logging
import re
import json
import io
import os
from gradio_client import Client
import shutil # Used to move the downloaded file
import time  # ← IMPORTANT: Use this, NOT "from datetime import time"
import requests
import random
import jwt  # ← NEW: Install with "pip install PyJWT"
from datetime import date
from pptx.util import Inches, Pt
from django.conf import settings
from .models import Course, CourseAssignment
from gtts import gTTS
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import uuid  # <--- This was missing
import cv2   # Requires: pip install opencv-python
import numpy as np
import anthropic  # ✅ Import Anthropic
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
import google.generativeai as genai
from datetime import date
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from django.conf import settings
logger = logging.getLogger(__name__)

# ==========================================
# 1. CONFIGURE GOOGLE GEMINI (AUTO-DETECT)
# ==========================================

GOOGLE_API_KEY = settings.GOOGLE_API_KEY
model = None

try:
    # genai.configure(api_key=GOOGLE_API_KEY)
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    
    available_models = []
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            available_models.append(m.name)
            
    logger.info(f"🔍 Found Models: {available_models}")

    selected_model_name = None
    if 'models/gemini-1.5-flash' in available_models:
        selected_model_name = 'gemini-1.5-flash'
    elif 'models/gemini-pro' in available_models:
        selected_model_name = 'gemini-pro'
    elif len(available_models) > 0:
        selected_model_name = available_models[0].replace('models/', '')

    if selected_model_name:
        model = genai.GenerativeModel(selected_model_name)
        logger.info(f"✅ AI Configured using: {selected_model_name}")
    else:
        logger.error("❌ No valid AI models found for this key.")

except Exception as e:
    logger.error(f"❌ AI Config Error: {e}")


# ==========================================
# 2. LMS AI ENGINE CLASS
# ==========================================

class LMSAIEngine:
    
    # # ✅ KLING AI CREDENTIALS (INSIDE THE CLASS)
    # KLING_ACCESS_KEY = "ADpHLYBHyMfYdpyTLJEy3hfTAPYmTf9r"
    # KLING_SECRET_KEY = "ptFy8LPytJaheFQkGDkC4DENBamyDMgG"

    ANTHROPIC_API_KEY = settings.ANTHROPIC_API_KEY
    DESIGN_THEMES = [
        {
            "name": "Corporate Blue",
            "bg_color": (255, 255, 255),
            "primary": (0, 51, 102),
            "secondary": (255, 165, 0),
            "text_dark": (40, 40, 40),
            "text_light": (100, 100, 100),
            "image_style": "professional corporate photography, 4k, modern office"
        },
        {
            "name": "Dark Executive",
            "bg_color": (25, 25, 35),
            "primary": (255, 255, 255),
            "secondary": (0, 200, 255),
            "text_dark": (220, 220, 220),
            "text_light": (150, 150, 150),
            "image_style": "dark theme, professional, elegant, minimalist"
        },
        {
            "name": "Fresh Green",
            "bg_color": (245, 250, 245),
            "primary": (34, 120, 80),
            "secondary": (255, 200, 50),
            "text_dark": (30, 30, 30),
            "text_light": (80, 80, 80),
            "image_style": "nature, eco-friendly, green technology, sustainable"
        },
        {
            "name": "Modern Purple",
            "bg_color": (250, 248, 255),
            "primary": (88, 28, 135),
            "secondary": (236, 72, 153),
            "text_dark": (45, 45, 45),
            "text_light": (100, 100, 100),
            "image_style": "modern, tech, gradient, innovative, creative"
        },
        {
            "name": "Warm Orange",
            "bg_color": (255, 252, 248),
            "primary": (180, 83, 9),
            "secondary": (251, 146, 60),
            "text_dark": (50, 50, 50),
            "text_light": (120, 120, 120),
            "image_style": "warm colors, creative, energetic, vibrant"
        },
        {
            "name": "Ocean Blue",
            "bg_color": (240, 249, 255),
            "primary": (3, 105, 161),
            "secondary": (14, 165, 233),
            "text_dark": (30, 30, 30),
            "text_light": (100, 100, 100),
            "image_style": "ocean, water, calm, professional, blue tones"
        }
    ]
    # ==========================================
    # WEATHER FEATURE
    # ==========================================
    @staticmethod
    def get_live_weather(city=""):
        """
        Fetches weather with SSL verification disabled.
        """
        try:
            location = city if city else ""
            url = f"https://wttr.in/{location}?format=3"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            print(f"☁️ Attempting to fetch weather from: {url}")
            response = requests.get(url, headers=headers, timeout=5, verify=False)

            if response.status_code == 200:
                weather_text = response.text.strip()
                print(f"✅ Weather Success: {weather_text}")
                return weather_text
            else:
                print(f"❌ Weather Failed Status: {response.status_code}")
                return "Weather data unavailable."
        
        except Exception as e:
            print(f"❌ WEATHER CRITICAL ERROR: {e}")
            return "Weather service connection failed."

    # ==========================================
    # CHATBOT RESPONSE
    # ==========================================
    @staticmethod
    def chatbot_response(user, query, history=[]):
        if not model:
            return "System Error: AI model not configured correctly."

        # Image Generation Feature
        image_keywords = ["generate image", "create image", "draw", "picture of"]
        if any(k in query.lower() for k in image_keywords):
            clean_prompt = re.sub(r'generate image|create image|draw|picture of', '', query, flags=re.IGNORECASE).strip()
            return f"Here is your image:\n\n![Generated Image](https://image.pollinations.ai/prompt/{clean_prompt.replace(' ', '%20')})"

        try:
            # Get Date
            today_str = date.today().strftime("%A, %B %d, %Y")

            # Get Weather
            current_weather = "Not requested"
            if "weather" in query.lower() or "temperature" in query.lower():
                city = ""
                match = re.search(r"in\s+([a-zA-Z]+)", query, re.IGNORECASE)
                if match:
                    city = match.group(1)
                current_weather = LMSAIEngine.get_live_weather(city)

            # Get LMS Data
            profile = getattr(user, 'lms_profile', None)
            name = profile.firstName if profile else user.first_name
            assignments = CourseAssignment.objects.filter(employee=user)
            active = [a.course.title for a in assignments if not a.is_course_completed]

            # System Instruction
            system_instruction = f"""
            [SYSTEM INSTRUCTION]
            You are an advanced AI Assistant for an LMS Platform.
            
            --- REAL-TIME DATA ---
            User: {name}
            Date: {today_str}
            Weather Status: {current_weather}
            Active Courses: {", ".join(active) or "None"}
            ----------------------
            
            Guidelines:
            1. WEATHER: If 'Weather Status' contains valid data, report it clearly.
            2. LMS: Use the Active Courses list if asked about studies.
            3. GENERAL: Answer helpfully.
            
            [USER QUERY]:
            {query}
            """

            # Format History
            gemini_history = []
            for msg in history:
                role = 'user' if msg.get('sender') == 'user' else 'model'
                if msg.get('text'):
                    gemini_history.append({'role': role, 'parts': [msg.get('text')]})

            # Generate Response
            chat = model.start_chat(history=gemini_history)
            response = chat.send_message(system_instruction)
            return response.text

        except Exception as e:
            logger.error(f"Gemini Chat Error: {e}")
            return f"I encountered an error processing your request. ({str(e)})"

    # ==========================================
    # SLIDE/PPT GENERATION
    # ==========================================
    @staticmethod
    def generate_ppt_content(user_prompt):
        """
        AI Logic: 
        1. Reads user prompt.
        2. Extracts specific color instructions (e.g., "Make it Green").
        3. Generates the JSON content + RGB values.
        """
        
        system_instruction = f"""
        User Request: "{user_prompt}"

        --------------------------------------------------
        [SYSTEM ROLE]
        You are a professional PowerPoint Designer.
        
        [DESIGN INSTRUCTIONS - CRITICAL]
        1. **Check for Color Requests:** Did the user mention a color? (e.g., "blue theme", "make it red", "green ppt").
           - **IF YES:** You MUST use that color as the primary theme.
             - Example: User says "Green" -> Background could be Pale Green [235, 250, 235] and Title Dark Green [0, 100, 0].
           - **IF NO:** Invent a color scheme that matches the "mood" of the topic.
        
        2. **Contrast Rule:** Ensure the Text Color is readable against the Background Color. 
           - Dark Background -> Light Text.
           - Light Background -> Dark Text.

        [OUTPUT FORMAT]
        Strictly output VALID JSON (no markdown):
        {{
            "theme_name": "Custom Theme",
            "colors": {{
                "background_rgb": [R, G, B], 
                "title_rgb": [R, G, B],
                "text_rgb": [R, G, B]
            }},
            "presentation_title": "Main Title",
            "slides": [
                {{
                    "title": "Slide Title",
                    "content": ["Point 1", "Point 2", "Point 3"]
                }}
            ]
        }}
        """

        try:
            # Assuming 'model' is globally configured in this file
            response = model.generate_content(system_instruction)
            text_response = response.text
            
            # Clean JSON
            clean_json = text_response.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_json)

        except Exception as e:
            print(f"❌ AI JSON Error: {e}")
            return None

    @staticmethod
    def create_ppt_file(data):
        try:
            prs = Presentation()
            
            # 1. EXTRACT COLORS (With fallbacks)
            colors = data.get('colors', {})
            bg_rgb = colors.get('background_rgb', [255, 255, 255]) # Default White
            title_rgb = colors.get('title_rgb', [0, 0, 0])         # Default Black
            text_rgb = colors.get('text_rgb', [80, 80, 80])        # Default Gray

            # Helper to apply background color
            def set_slide_background(slide, rgb_values):
                background = slide.background
                fill = background.fill
                fill.solid()
                fill.fore_color.rgb = RGBColor(rgb_values[0], rgb_values[1], rgb_values[2])

            # --- A. TITLE SLIDE ---
            slide = prs.slides.add_slide(prs.slide_layouts[0])
            set_slide_background(slide, bg_rgb)
            
            # Title
            title = slide.shapes.title
            title.text = data.get('presentation_title', "Presentation")
            
            # Style Title
            p = title.text_frame.paragraphs[0]
            p.font.color.rgb = RGBColor(*title_rgb)
            p.font.bold = True
            p.font.size = Pt(44)

            # Subtitle
            subtitle = slide.placeholders[1]
            subtitle.text = "Generated by AI Assistant"
            p_sub = subtitle.text_frame.paragraphs[0]
            p_sub.font.color.rgb = RGBColor(*text_rgb)

            # --- B. CONTENT SLIDES ---
            for slide_data in data.get('slides', []):
                slide = prs.slides.add_slide(prs.slide_layouts[1])
                set_slide_background(slide, bg_rgb)

                # 1. Slide Title
                if slide.shapes.title:
                    title_shape = slide.shapes.title
                    title_shape.text = slide_data.get('title', "")
                    
                    p = title_shape.text_frame.paragraphs[0]
                    p.font.color.rgb = RGBColor(*title_rgb)
                    p.font.bold = True
                    p.font.name = "Arial"

                # 2. Slide Content
                if len(slide.placeholders) > 1:
                    body = slide.placeholders[1]
                    tf = body.text_frame
                    tf.clear() 
                    
                    for point in slide_data.get('content', []):
                        p = tf.add_paragraph()
                        p.text = point
                        p.level = 0
                        
                        # Style Bullets
                        p.font.color.rgb = RGBColor(*text_rgb)
                        p.font.size = Pt(18)
                        p.space_after = Pt(14) 

            # --- SAVE FILE ---
            filename = f"ppt_{uuid.uuid4().hex[:6]}.pptx"
            save_dir = os.path.join(settings.MEDIA_ROOT, 'ai_media')
            os.makedirs(save_dir, exist_ok=True)
            
            full_path = os.path.join(save_dir, filename)
            prs.save(full_path)

            return {
                "full_path": full_path,
                "relative_path": f"ai_media/{filename}",
                "filename": filename
            }

        except Exception as e:
            print(f"❌ PPT Creation Error: {e}")
            import traceback
            traceback.print_exc()
            return None

    # ---------------------------------------------------------
    # 3. GENERATE VIDEO (GOOGLE VEO 3.1)
    # ---------------------------------------------------------
    @staticmethod
    def generate_veo_video(prompt):
        """
        Generates video using a Public Hugging Face Space via Gradio.
        Repo: hysts/ModelScope-text-to-video-synthesis (Free, No Login Required)
        """
        if not prompt:
            return {"error": "Prompt is missing"}

        print(f"🎬 Sending Gradio Video Request: {prompt}")

        try:
            # 1. Initialize Client with a PUBLIC Space
            # 'hysts' is a public clone of the original ModelScope space
            # This avoids the "gated repo" / "invalid username" errors
            client = Client("hysts/ModelScope-text-to-video-synthesis")

            # 2. Trigger Generation
            # Parameters: Prompt, Seed (-1=Random), Frames (16), Steps (25)
            # Note: The parameters for hysts/ModelScope are slightly simpler
            result_path = client.predict(
                prompt, 
                -1, 
                16, 
                25, 
                api_name="/infer"
            )

            print(f"✅ Video generated at temp path: {result_path}")

            # 3. Move File to Django Media Folder
            filename = f"ai_video_{uuid.uuid4().hex[:8]}.mp4"
            media_rel_path = 'ai_media'
            save_dir = os.path.join(settings.MEDIA_ROOT, media_rel_path)
            os.makedirs(save_dir, exist_ok=True)
            
            full_path = os.path.join(save_dir, filename)

            # Move the downloaded MP4 to your media directory
            shutil.move(result_path, full_path)

            return {
                "video_url": f"{settings.MEDIA_URL}{media_rel_path}/{filename}",
                "duration": "2 seconds",
                "model": "ModelScope (Gradio/Hysts)",
                "status": "success",
                "filename": filename
            }

        except Exception as e:
            print(f"❌ Gradio Error: {str(e)}")
            return {"error": f"Video Generation Failed: {str(e)}"}