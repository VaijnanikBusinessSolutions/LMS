# from django.apps import AppConfig

# class App1Config(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'app1'

#     def ready(self):
#         import app1.signals  # Safe to import here, signals will work
#     def ready(self):
#         print("🚀 App1 ready() called")
#         import app1.signals

# app1/apps.py

# from django.apps import AppConfig
# import sys
# import os

# class App1Config(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'app1'
    
#     def ready(self):
#         """
#         This method is called when Django starts
#         We use it to automatically start the scheduler
#         """
#         # Don't start scheduler during migrations or other management commands
#         if any(cmd in sys.argv for cmd in ['makemigrations', 'migrate', 'test', 'shell', 'createsuperuser']):
#             return
        
#         # Import scheduler module
#         from . import scheduler
        
#         # Start scheduler only in the main process (not in Django's reloader child process)
#         # Django runserver spawns a child process for auto-reloading, we only want scheduler in parent
#         if os.environ.get('RUN_MAIN') == 'true' or 'runserver' not in sys.argv:
#             scheduler.start_scheduler()

#     def __str__(self):
#         return self.name


from django.apps import AppConfig
from django.conf import settings
import sys
import os

class App1Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app1'
    
    def ready(self):
        """
        This method is called when Django starts.
        We load signals AND start scheduler.
        """

        # 🔥 ALWAYS load signals first
        import app1.signals

        # ❌ Do NOT start scheduler during migrations or shell
        if any(cmd in sys.argv for cmd in [
            'makemigrations', 'migrate', 'test',
            'shell', 'createsuperuser'
        ]):
            return

        if not settings.ENABLE_APSCHEDULER:
            return

        # Import scheduler module
        from . import scheduler
        
        # Start scheduler in main process only
        if os.environ.get('RUN_MAIN') == 'true' or 'runserver' not in sys.argv:
            scheduler.start_scheduler()

    def __str__(self):
        return self.name
