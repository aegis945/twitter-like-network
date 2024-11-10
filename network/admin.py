from django.contrib import admin
from .models import Comment, Follow, Post, User

admin.site.register(Comment)
admin.site.register(Follow)
admin.site.register(Post)
admin.site.register(User)
