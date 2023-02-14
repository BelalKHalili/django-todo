from django.urls import path
from . import views

app_name = 'todo'

urlpatterns = [
    path('', views.index, name='index'),
    path('delete/<int:taskid>', views.delete_task, name='delete'),
    path('add/', views.add_task, name='add'),
    path('edit/<int:taskid>', views.edit_task, name='edit')
    # path('list/', views.todolist, name='todolist')
]