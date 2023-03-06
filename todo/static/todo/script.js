main_url = 'http://127.0.0.1:8000/todo/'

var save_button = document.querySelector('#save-button')


// ----------------------------------------------------------------------------------
save_button.addEventListener('click', () => {
  if (save_button.dataset.editstate == 'false') {
    saveTask()
  } else {
    saveEditTask()
  }
})

// ----------------------------------------------------------------------------------
function saveTask() {
  let todotext = document.getElementById('todotext').value;
  data = {
    'task': todotext,
    'checked': 'False'
  }

  let csrftoken = getCookie('csrftoken')
  fetch(`${main_url}add/`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)

      // make a new list item based on returnd data from API data
      var item1 = document.querySelector('.col-md-8')

      item1.innerHTML += `
      <div class="card mb-3" id="card-${data['id']}">
      <div class="card-body">
        <div class="row">
          <div class="form-check col-sm-8 text-left">
            <input class="form-check-input" type="checkbox"
              onchange="checkTask('${data['id']}')" id="check-${data['id']}">
            <label class="form-check-label" for="check-${data['id']}">
              <p for="check-${data['id']}" id="task-${data['id']}">${data['task']}</p>
            </label>
          </div>

          <div class="col-sm-2 text-right">
            <a href="#" onclick="editTask('${data['id']}')" class="btn btn-info ml-5">Edit</a>
          </div>
          <div class="col-sm-2 text-right">
            <a href="#" onclick="deleteTask('${data['id']}')" class="btn btn-danger ml-5">X</a>
          </div>
        </div>
      </div>
    </div>
      `
    })
  // Reset form-Task
  document.getElementById('form-Task').reset();
  document.getElementById('todotext').focus()
}


// ----------------------------------------------------------------------------------
function checkTask(itemId) {
  check_data = {'checked': ''}
  if (document.querySelector(`#check-${itemId}`).checked == true) {
    check_data.checked = 'True'
  } else {
    check_data.checked = 'False'
  }
  let csrftoken = getCookie('csrftoken')
  // sending data to backend
  fetch(`${main_url}check/${itemId}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(check_data)
    })
   .then(res => res.json())
   .then(data => {
    // update interface
    if (data['check'] == 'True') {
      document.querySelector(`#task-${itemId}`).classList.add('text-decoration-line-through')
    } else {
      document.querySelector(`#task-${itemId}`).classList.remove('text-decoration-line-through')
    }
   })
}


// ----------------------------------------------------------------------------------
function deleteTask(itemId) {
  // TODO: how to make fetch send delete request
  fetch(`${main_url}delete/${itemId}`)
    .then(res => res.json())
    .then(data => {
      var card = document.querySelector(`#card-${data['data']}`)
      card.remove()
      cancelTask()
    })
}


// ----------------------------------------------------------------------------------
function cancelTask() {
  if (document.querySelector('#cancel-button')) {
    document.querySelector('#cancel-button').remove()
  }
  document.querySelector('#save-button').classList.replace('btn-primary', 'btn-success')
  document.getElementById('form-Task').reset()
  document.querySelector('#todotext').focus()
  save_button.dataset.editstate = 'false'
}


// ----------------------------------------------------------------------------------
function editTask(itemId) {
  fetch(`${main_url}edit/${itemId}`)
    .then(res => res.json())
    .then(data => {
      let todotext = document.getElementById('todotext');
      todotext.value = data['task']
      document.querySelector('#save-button').classList.replace('btn-success', 'btn-primary')
      save_button.dataset.editstate = 'true'
      whichItemToEdit = itemId

      // making cancel button if it not already exist
      if (!document.querySelector('#cancel-button')) {
        let formTask = document.querySelector('#form-Task')
        let cancelButton = document.createElement('button')
        let cancelText = document.createTextNode('Cancel')
        cancelButton.appendChild(cancelText)
        cancelButton.setAttribute('id', 'cancel-button')
        cancelButton.setAttribute('onclick', 'cancelTask()')
        cancelButton.classList.add('btn', 'btn-secondary', 'btn-block')
        formTask.appendChild(cancelButton)
      }
    document.getElementById('todotext').focus()
    })
}


// ----------------------------------------------------------------------------------
whichItemToEdit = ''
function saveEditTask() {
      // taking data from forms before the save button is clicked
      document.querySelector('#todotext')
      postdata = {
        'id': whichItemToEdit,
        'task': todotext.value
      }
      let csrftoken = getCookie('csrftoken')
  
      // sending data to backend
      fetch(`${main_url}edit/${whichItemToEdit}`, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
          },
          body: JSON.stringify(postdata)
        })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          // make the changes in display
          document.querySelector(`#task-${data['id']}`).innerHTML = data['task']
          // reseting form for later use
          document.querySelector('#save-button').classList.replace('btn-primary', 'btn-success')
          document.querySelector('#cancel-button').remove()
          document.getElementById('form-Task').reset()
        })
        save_button.dataset.editstate = 'false'
        document.getElementById('todotext').focus()
}


// ----------------------------------------------------------------------------------
// Working with cookie
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}