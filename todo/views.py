from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Todo
from .serializers import TodoSerializers
import json
# Create your views here.

def index(request):
    data = Todo.objects.all()
    return render(request,'todo/home.html', {'todos':data})

# @api_view(['GET'])
# def todolist(request):
#     data = Todo.objects.all()
#     todoList_serialized = TodoSerializers(data, many=True)
#     return JsonResponse(todoList_serialized.data, safe=False)


@api_view(['DELETE', 'GET'])
def delete_task(request, taskid):
    if request.method == "DELETE" or "GET":
        taskdel = Todo.objects.get(id=taskid)
        taskdel.delete()
        return JsonResponse({'data': taskid})
    
def edit_task(request, taskid):
    if request.method == 'POST':
        jsondata = json.loads(request.body)
        taskedi = Todo.objects.get(id=taskid)

        # update data
        taskedi.title = jsondata['title']
        taskedi.description = jsondata['description']
        taskedi.save()
        # return data
        return JsonResponse(TodoSerializers(taskedi).data)

    elif request.method == 'GET':
        taskedi = Todo.objects.get(id=taskid)
        return JsonResponse(TodoSerializers(taskedi).data)

@api_view(['POST'])
def add_task(request):
    if request.method == "POST":
        serialized_todo = TodoSerializers(data=request.data)
        if serialized_todo.is_valid():
            serialized_todo.save()
            return JsonResponse(serialized_todo.data)