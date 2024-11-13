from django.urls import path

from . import views

app_name = "network"

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    path("toggle_like/<int:post_id>/", views.toggle_like, name="toggle_like"),
    path("profile/<str:username>/", views.profile, name="profile"),
    path("toggle_follow/<str:username>/", views.toggle_follow, name="toggle_follow"),
    path("following/", views.following, name="following")
]
