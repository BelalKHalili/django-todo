from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import Todo
from .serializers import TodoSerializers
import json

# Create your views here.
def home(request):
    data = Todo.objects.all()
    return render(request,'todo/home.html', {'todos':data})

# the idea for this is to take list of existing todos with fetch request in json app(making better use of one page web app)
# @api_view(['GET'])
# def todolist(request):
#     data = Todo.objects.all()
#     todoList_serialized = TodoSerializers(data, many=True)
#     return JsonResponse(todoList_serialized.data, safe=False)


@api_view(['DELETE', 'GET'])
def delete_todo(request, taskid):
    if request.method == "DELETE" or "GET":
        taskdel = Todo.objects.get(id=taskid)
        taskdel.delete()
        return JsonResponse({'data': taskid})
    
def edit_todo(request, taskid):
    if request.method == 'POST':
        jsondata = json.loads(request.body)
        taskedi = Todo.objects.get(id=taskid)

        # update data
        taskedi.task = jsondata['task']
        taskedi.save()
        # return data
        return JsonResponse(TodoSerializers(taskedi).data)

    elif request.method == 'GET':
        taskedi = Todo.objects.get(id=taskid)
        return JsonResponse(TodoSerializers(taskedi).data)

@api_view(['POST'])
def add_todo(request):
    if request.method == "POST":
        serialized_todo = TodoSerializers(data=request.data)
        if serialized_todo.is_valid():
            serialized_todo.save()
            return JsonResponse(serialized_todo.data)