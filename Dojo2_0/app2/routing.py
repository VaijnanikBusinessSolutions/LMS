from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # React calls: ws://127.0.0.1:8000/ws/groups/1/chat/
    re_path(r'ws/groups/(?P<group_id>\d+)/chat/$', consumers.GroupChatConsumer.as_asgi()),
]