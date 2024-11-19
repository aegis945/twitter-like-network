# Network Project

This project is a social network platform built with Django, featuring user authentication, post creation, editing, liking, following, and pagination.

## Features

1. **User Profiles**: 
   - Each user has a dedicated profile page showing their username, follower count, and posts.

2. **Post Creation**: 
   - Users can create text-based posts visible to the users.

3. **Edit Posts**: 
   - Authenticated users can edit their own posts.

4. **Like/Unlike Posts**: 
   - Users can like or unlike posts, and the like count updates dynamically.

5. **Follow/Unfollow Users**: 
   - Users can follow or unfollow others, with updates reflected in follower/following counts.

6. **Pagination**: 
   - Posts are paginated for a cleaner user experience and improved performance.

7. **Feed View**: 
   - A "following" feed lets users view posts exclusively from users they follow.

8. **Dynamic UI Updates**: 
   - Seamless interactions through JavaScript for features like liking/unliking, editing posts, and real-time updates for the user without page reloads.

## Installation
1. **Clone the Repository**:
```bash
git clone https://github.com/aegis945/twitter-like-network
cd twitter-like-network
```
2. **Create a Virtual Environment**
```bash
python -m venv venv
```
3. **Activate the Virtual Environment**:
   
  - On macOS/Linux:
```bash
source venv/bin/activate
```
  - On Windows: 
```bash
venv\Scripts\activate
```
4. **Install dependencies**:
```bash
pip install -r requirements.txt
```
5. **Set Up Environment Variables: Create a .env file in the project root directory and define your environment variables**:
```bash
SECRET_KEY=your_secret_key
DEBUG=True
```
6. **Run dev server**:
```bash
python manage.py runserver
```
7. **Open your web browser and go to http://127.0.0.1:8000**
