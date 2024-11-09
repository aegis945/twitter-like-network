document.addEventListener('DOMContentLoaded', () => {
    handleLikeButton();
    infiniteScroll()
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

function infiniteScroll() {
    let page = 2;
    let loading = false;
    const isMobile = () => window.innerWidth <= 991;

    window.onscroll = () => {
        if (!isMobile() || loading) return;

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            loading = true;
            fetch(`/posts/?page=${page}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    document.querySelector('#posts-container').insertAdjacentHTML('beforeend', data.html);
                    if (data.has_next) {
                        page++;
                        loading = false;
                    } else {
                        window.onscroll = null;
                    }
                })
                .catch(error => {
                    console.error("Error loading posts:", error);
                    loading = false;
                });
        }
    };
}
