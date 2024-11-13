from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from .forms import NewPostForm
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.template.loader import render_to_string
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect

from .models import User, Post, Follow, Comment


def index(request):
    posts = Post.objects.all()
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    
    if request.headers.get("x-requested-with") == "XMLHttpRequest":
        return render(request, "network/posts_partial.html", {"page_obj": page_obj})

    return render(request, "network/index.html", {
        "form": NewPostForm(), 
        "page_obj": page_obj
    })
    
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return redirect("network:index")
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return redirect("network:index")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return redirect("network:index")
    else:
        return render(request, "network/register.html")

@login_required
def new_post(request):
    if request.method == "POST":
        form = NewPostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            return redirect("network:index")
    else:
        form = NewPostForm()
        
    return render(request, "network/index.html", {
        "form": form,
        "posts": Post.objects.all()
    })

@csrf_protect
def toggle_like(request, post_id):
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'User not authenticated'}, status=400)

    post = get_object_or_404(Post, id=post_id)

    if request.user in post.likes.all():
        post.likes.remove(request.user)
        liked = False
    else:
        post.likes.add(request.user)
        liked = True

    return JsonResponse({
        "success": True,
        "liked": liked,
        "like_count": post.like_count
    })
    
def profile(request, username):
    user_profile = get_object_or_404(User, username=username)
    followers_count = user_profile.followed_by.count()
    following_count = user_profile.following.count()
    is_following = False
    
    if request.user.is_authenticated:
        is_following = request.user.following.filter(following=user_profile).exists()
    
    posts = user_profile.post_set.all()
    paginator = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    
    return render(request, "network/profile.html", {
        "user_profile": user_profile,
        "followers_count": followers_count,
        "following_count": following_count,
        "is_following": is_following,
        "page_obj": page_obj
    })
    
@login_required
def toggle_follow(request, username):
    if request.method == "POST":
        user_to_follow = get_object_or_404(User, username=username)
        
        if request.user == user_to_follow:
            return JsonResponse({"success": False, "message": "You cannot follow yourself."}, status=400)
        
        if request.user.following.filter(following=user_to_follow).exists():
            request.user.following.filter(following=user_to_follow).delete()
            following = False
        else:
            Follow.objects.create(follower=request.user, following=user_to_follow)
            following = True
            
        followers_count = user_to_follow.followed_by.count()
        
        return JsonResponse({
            "success": True,
            "following": following,
            "followers_count": followers_count
        })
        
    return JsonResponse({"success": False,"message": "Invalid request method."},status=405) 