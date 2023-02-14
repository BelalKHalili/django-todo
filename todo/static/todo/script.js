// main_url = 'http://127.0.0.1:8000/todo/'
main_url = 'http://192.168.1.103:8000/todo/'
var save_button = document.querySelector('#save-button')

// Delete To-Do
function deleteTask(itemId) {
  // TODO: how to make fetch send delete request
  fetch(`${main_url}delete/${itemId}`)
  .then(res => res.json())
  .then(data => {
      var card = document.querySelector(`#card${data['data']}`)
      card.remove()
      // cancelTask()
  })
}



function editTask(itemId) {
  fetch(`${main_url}edit/${itemId}`)
  .then(res => res.json())
  .then(data => {
    // putting values to form and changing color and editstate of save button
    // !!! edit state somethign that after clicking edit buttons save button functionality is gonna change but the elemnt is staying still

    let title = document.getElementById('title');
    let description = document.getElementById('description');
    title.value = data['title']
    description.value = data['description']
    document.querySelector('#save-button').classList.replace('btn-success', 'btn-primary')
    save_button.dataset.editstate = 'true' 
    
    // making cancel button if it not already exist
    if (!document.querySelector('.btn-secondary')) {
      let formTask = document.querySelector('#form-Task')
      let cancelButton = document.createElement('button')
      let cancelText = document.createTextNode('Cancel')
      cancelButton.appendChild(cancelText)
      cancelButton.setAttribute('id', 'cancel-button')
      cancelButton.setAttribute('onclick', 'cancelTask()')
      cancelButton.classList.add('btn', 'btn-secondary', 'btn-block')
      formTask.appendChild(cancelButton)
    }

    if (save_button.dataset.editstate == 'true') {
      save_button.onclick = function() {
        // taking data from forms before the save button is clicked
        postdata = {
          'id': itemId,
          'title': title.value,
          'description': description.value
        }
        let csrftoken = getCookie('csrftoken')

        // sending data to backend
        fetch(`${main_url}edit/${itemId}`, {
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
          document.querySelector(`#title-${data['id']}`).innerHTML = data['title']
          document.querySelector(`#description-${data['id']}`).innerHTML = data['description']
          // reseting form for later use
          document.querySelector('#save-button').classList.replace('btn-primary', 'btn-success')
          document.querySelector('#cancel-button').remove()
          document.getElementById('form-Task').reset()   
        })
      }
    }
    save_button.dataset.editstate = 'false'

  })
}






function cancelTask() {
  document.querySelector('#cancel-button').remove()
  document.querySelector('#save-button').classList.replace('btn-primary', 'btn-success')
  document.getElementById('form-Task').reset();
  document.querySelector('#title').focus()
}






// i think this is not gonna work at start of program or page loadin
save_button.onclick = function() {
  if (save_button.dataset.editstate == 'false') {
    saveTask()
  }
}

// Save new To-Do
function saveTask() {
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  data = {
    'title': title,
    'description': description
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
      <div class="card mb-3" id="card${data['id']}">
      <div class="card-body">
          <div class="row">
              <div class="col-sm-3 text-left">
                  <p style="text-align: center;" id="title-${data['id']}" class="fw-bold" >${data['title']}</p>
              </div>
              <div class="col-sm-7 text-left">
                  <p style="text-align: center;" id="description-${data['id']}" >${data['description']}</p>
              </div>
              <div class="col-sm-1 text-right">
                <a href="#" onclick="editTask('${data['id']}')" class="btn btn-info ml-5">Edit</a>
            </div>
              <div class="col-sm-1 text-right">
                <a href="#" onclick="deleteTask('${data['id']}')" class="btn btn-danger ml-5">X</a>
            </div>
          </div>
     </div>
  </div>
      `
    })

  // Reset form-Task
  document.getElementById('form-Task').reset();
  // e.preventDefault();

}

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
