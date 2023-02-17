from django.urls import path
from . import views

app_name = 'todo'

urlpatterns = [
    path('', views.home, name='home'),
    path('delete/<int:taskid>', views.delete_todo, name='delete'),
    path('add/', views.add_todo, name='add'),
    path('edit/<int:taskid>', views.edit_todo, name='edit')
]