from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from .models import Todo
from .serializers import TodoSerializers


# app
# --------------------------------------------------------------------------------
def home(request):
    if request.user.is_authenticated:
        data = Todo.objects.filter(user=request.user.id)
        return render(request,'todo/home.html', {'todos':data})
    return render(request, 'todo/tutorial.html')


@api_view(['POST'])
def add_todo(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = request.data
            todo_name = data['task']
            todo_statsu = data['checked']

            todo_user = User.objects.get(username=request.user.username)
            todo_add = Todo.objects.create(user=todo_user, task=todo_name, checked=todo_statsu)
            todo_add.save()
            return JsonResponse(TodoSerializers(todo_add).data)
        else:
            return JsonResponse({'error': 'method is not allowed'})
    return JsonResponse({'error': 'you must log in to your account'})


@api_view(['POST', 'GET'])
def edit_todo(request, taskid):
    if request.user.is_authenticated:
        if request.method == 'POST':
            todo_edit = Todo.objects.get(id=taskid, user=request.user.id)
            # update todo
            todo_edit.task = request.data['task']
            todo_edit.save()
            # return todo
            return JsonResponse(TodoSerializers(todo_edit).data)

        elif request.method == 'GET':
            todo_edit = Todo.objects.get(id=taskid, user=request.user.id)
            return JsonResponse(TodoSerializers(todo_edit).data)
    return JsonResponse({'error': 'you must log in to your account'})


@api_view(['POST'])
def check_todo(request, taskid):
    if request.user.is_authenticated:
        if request.method == 'POST':
            todo_check = Todo.objects.get(id=taskid, user=request.user.id)
            todo_check.checked = request.data['checked']
            todo_check.save()
            return JsonResponse({'check': todo_check.checked})
        else:
            return JsonResponse({'error': 'method is not allowed'})
    return JsonResponse({'error': 'you must log in to your account'})
        

@api_view(['DELETE', 'GET'])
def delete_todo(request, taskid):
    if request.user.is_authenticated:
        if request.method == "DELETE" or "GET":
            todo_delete = Todo.objects.get(id=taskid, user=request.user.id)
            todo_delete.delete()
            return JsonResponse({'data': taskid})
        else:
            return JsonResponse({'error': 'method is not allowed'})
    return JsonResponse({'error': 'you must log in to your account'})


# authentication
# --------------------------------------------------------------------------------
def login_user(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is None:
            context = {'error': 'Invalid username or password'}
            return render(request, 'todo/login.html', context)
        
        login(request, user)
        return redirect('/todo')

    return render(request, 'todo/login.html')


def signup_user(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        
        if password1 != password2:
            context =  {'error': 'Two passwords does not match', 'username': username, 'email':email}
            return render(request, 'todo/signup.html', context)
            
        User.objects.create_user(username, email, password1)
        user = authenticate(request, username=username, password=password1)
        login(request, user)
        return redirect('/todo')

    return render(request, 'todo/signup.html')


def logout_user(request):
    logout(request)
    return redirect('/todo')