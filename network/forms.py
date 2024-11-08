from django import forms
from .models import Post

class NewPostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content']
        
    content = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': "Write a new post...",
            'class': 'form-control',
            'rows': '4',
        }),
        label="What's on your mind?"
    )
