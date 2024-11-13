document.addEventListener('DOMContentLoaded', () => {
    handleLikeButton();
    handleFollowButton();
    handleEditButton();
    handleDeleteButton();
});

function handleLikeButton() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', () => {
            const postId = button.dataset.postId;
            const csrftoken = getCookie('csrftoken');

            fetch(`/toggle_like/${postId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const icon = button.querySelector('i');
                    if (data.liked) {
                        icon.classList.remove('bi-heart');
                        icon.classList.add('bi-heart-fill');
                        button.classList.remove('text-muted');
                        button.classList.add('text-danger');
                    } else {
                        icon.classList.remove('bi-heart-fill');
                        icon.classList.add('bi-heart');
                        button.classList.remove('text-danger');
                        button.classList.add('text-muted');
                    }
                    const likeCountSpan = button.nextElementSibling;
                    likeCountSpan.textContent = `${data.like_count} likes`;
                } else {
                    alert('Error: ' + (data.message || 'Something went wrong.'));
                }
            })
            .catch(error => {
                console.error('Error during fetch:', error);
                alert('An error occurred while processing your request.');
            });
        });
    });
}

function handleFollowButton() {
    const followButton = document.querySelector('#follow-btn');

    if (followButton) {
        followButton.addEventListener('click', () => {
            const username = followButton.dataset.username;
            const csrftoken = getCookie('csrftoken');

            fetch(`/toggle_follow/${username}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    if (data.following) {
                        followButton.textContent = 'Unfollow';
                        followButton.classList.remove('btn-primary');
                        followButton.classList.add('btn-danger');
                    } else {
                        followButton.textContent = 'Follow';
                        followButton.classList.remove('btn-danger');
                        followButton.classList.add('btn-primary');
                    }

                    const followersCountElement = document.querySelector('div.mx-2 span');
                    followersCountElement.textContent = data.followers_count;
                } else {
                    alert('Error: ' + (data.message || 'Something went wrong.'));
                }
            })
            .catch(error => {
                console.error('Error during fetch:', error);
                alert('An error occurred while processing your request.');
            });
        });
    }
}

function handleEditButton() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const postId = button.dataset.postId;
            const postContentElement = document.querySelector(`#content-text-${postId}`);
            const postEditElement = document.querySelector(`#edit-content-${postId}`);

            postContentElement.style.display = 'none';
            postEditElement.style.display = 'block';

            const editTextArea = document.querySelector(`#edit-textarea-${postId}`);
            editTextArea.value = postContentElement.textContent;

            document.querySelector(`.save-btn[data-post-id="${postId}"]`).addEventListener('click', () => {
                savePostEdit(postId, editTextArea.value);
            });

            document.querySelector(`.cancel-btn[data-post-id="${postId}"]`).addEventListener('click', () => {
                postContentElement.style.display = 'block';
                postEditElement.style.display = 'none';
            });
        });
    });
}

function savePostEdit(postId, updatedContent) {
    const csrftoken = getCookie('csrftoken');

    fetch(`/edit_post/${postId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({content: updatedContent})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const postContentElement = document.querySelector(`#content-text-${postId}`);
            const postEditElement = document.querySelector(`#edit-content-${postId}`);

            postContentElement.textContent = updatedContent;
            postContentElement.style.display = 'block';
            postEditElement.style.display = 'none';
        } else {
            alert('Error: ' + (data.message || 'Something went wrong.'));
        }
    })
    .catch(error => {
        console.error('Error during fetch:', error);
        alert('An error occurred while saving your post.');
    });
}

function handleDeleteButton() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const postId = button.dataset.postId;
            if (confirm("Are you sure you want to delete this post?")) {
                deletePost(postId)
            }
        });
    });
}

function deletePost(postId) {
    const csrftoken = getCookie('csrftoken');

    fetch(`/delete_post/${postId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const postElement = document.querySelector(`#content-${postId}`).closest('.post');
            postElement.classList.add('fade');
            setTimeout(() => {
                postElement.remove();
                const postsContainer = document.querySelector('#posts-container');
                if (postsContainer.children.length === 0) {
                    const noPostsMessage = document.createElement('p');
                    noPostsMessage.textContent = 'No posts yet.';
                    postsContainer.appendChild(noPostsMessage);
                }
            }, 300);
        } else {
            alert('Error: ' + (data.message || 'Something went wrong.'));
        }
    })
    .catch(error => {
        console.error('Error during fetch:', error);
        alert('An error occurred while deleting your post.');
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}