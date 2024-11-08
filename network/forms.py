from django import forms
from .models import Post

class NewPostForm(forms.ModelForm):
    content = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': "Write a new post...",
            'class': 'form-control mt-3',
            'rows': '4',
        }),
        label="What's on your mind?"
    )
    
    class Meta:
        model = Post
        fields = ['content']
