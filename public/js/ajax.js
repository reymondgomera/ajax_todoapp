/* I used "Event Delegation" meaning I only assign one event to the parent element then used it to multiple elements/childs */

// asynchronous function that automatically execute to fetch data from category table
(async () => {
    // fetch categories
    try {
        // fetch
        const response = await fetch('http://localhost:5000/categories');

        // get the actual data
        const data = await response.json();

        // put dataOutput with a default option eleme6nt
        let dataOutput = '<option class="fs-6" value="none" selected>Chooses Category</option>';

        // iterate over the data
        data.forEach(el => {
            dataOutput += `<option class="fs-6" value="${el.category_id}">${el.category_name}</option>`;
        });

        // set the innerHTML of select element
        document.querySelector('#category').innerHTML = dataOutput;
    } catch (err) {
        console.error(err.message);
    }
})();

// asynchronous function that automatically execute to fetch data from todo_list
(async () => {
    // fetch todos
    try {
        // fetch
        const response = await fetch('http://localhost:5000/todo_list');

        // get the actual data
        const data = await response.json();

        let dataOutput = '';

        // iterate over the data
        data.forEach(el => {
            dataOutput += `
                <tr data-todo-id="${`id${el.todo_id}`}">
                    <td>${el.todo_desc}</td>
                    <td>${el.todo_date}</td>
                    <td>${el.category_name}</td>
                    <td>${el.todo_remarks}</td>
                    <td onclick="remarksDelete(event)">
                        <button data-btn-name="edit-btn1" type="button" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="${`#id${el.todo_id}`}">Edit</button>
                        <div class="modal fade" id="${`id${el.todo_id}`}" tabindex="-1">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Edit Todo</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div class="modal-body">
                                         <input value="" class="form-control" type="text" required/>
                                    </div>
                                    <div class="modal-footer" onclick="editTodo(event)" >
                                        <button type="button" class="btn btn-outline-warning" data-btn-edit="1" data-tid="${
                                            el.todo_id
                                        }" data-bs-dismiss="modal">Edit</button>
                                        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                                            
                        <button data-btn-edit="2" data-tid="${el.todo_id}" class="btn btn-outline-success ms-3">Remarks</button>
                        
                        <button type="button" class="btn btn-outline-danger ms-3" data-bs-toggle="modal" data-bs-target="${`#id-delete${el.todo_id}`}">Delete</button>
                        <div class="modal fade" id="${`id-delete${el.todo_id}`}" tabindex="-1">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Confirmation Message</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div class="modal-body">
                                        <span>Are you sure you're going to delete this todo?</span> 
                                    </div>
                                    <div class="modal-footer">
                                        <button data-btn-edit="3" data-tid="${
                                            el.todo_id
                                        }" class="btn btn-outline-danger ms-3" data-bs-dismiss="modal">Delete</button>
                                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                        `;
            document.querySelector('#todo-table-body').innerHTML = dataOutput;
        });
    } catch (err) {
        console.error(err.message);
    }
})();

const submitForm = async e => {
    e.preventDefault();
    try {
        const selectedcategory = document.querySelector('#category').value;
        const description = document.querySelector('#todo-description').value;

        if (selectedcategory != 'none' && description != '') {
            const body = { description, selectedcategory };

            // fetch
            const response = await fetch('http://localhost:5000/todos/create_todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            // get the actual data
            const data = await response.json();

            // use showMessage()
            showMessage(false, data.message, 'bg-success');
        } else showMessage(true, 'Please fill-in all fields!', 'bg-danger');
    } catch (err) {
        console.error(err.message);
    }
};

const setInputValue = e => {
    try {
        // making sure it should be the correct edit button, that serve as triggeer to set the input/description value
        if (e.target.nodeName === 'BUTTON' && e.target.dataset.btnName === 'edit-btn1') {
            // setting the value of unique input element of modal
            e.target.nextElementSibling.lastElementChild.children[0].children[1].children[0].value = e.path[2].cells[0].innerText;
        }
    } catch (error) {}
};

const editTodo = async e => {
    // function only execute if it is in the right edit button, or data-btn-id is not undefined
    if (e.target.dataset.btnEdit) {
        try {
            const todo_id = e.target.dataset.tid;
            const description = e.path[2].children[1].children[0].value;
            const body = { description };

            const response = await fetch(`http://localhost:5000/todos/update_todo/${todo_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            // get the actual data
            const data = await response.json();

            // use showMessage()
            showMessage(false, data.message, 'bg-success');
        } catch (err) {
            console.error(err.message);
        }
    }
};

const remarksDelete = async e => {
    if (e.target.dataset.btnEdit == 2) {
        try {
            // update Remarks
            const id = e.target.dataset.tid;
            let remarks = e.path[2].cells[3].innerText;

            // check if remarks is "In Progress" or done then update (viceversa)
            if (remarks === 'In Progress') remarks = 'Done';
            else remarks = 'In Progress';

            const body = { remarks };
            const response = await fetch(`http://localhost:5000/todos/update_remarks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            // get the actual data
            const data = await response.json();

            // use showMessage()
            showMessage(false, data.message, 'bg-success');
        } catch (err) {
            console.error(err.message);
        }
    } else if (e.target.dataset.btnEdit == 3) {
        try {
            // DELETE a todo
            // id from data set attribute
            const id = e.target.dataset.tid;
            const response = await fetch(`http://localhost:5000/todos/delete_todo/${id}`, { method: 'DELETE' });

            // get the actual data
            const data = await response.json();

            // use showMessage()
            showMessage(false, data.message, 'bg-success');
        } catch (err) {
            console.error(err.message);
        }
    }
};

const showMessage = (isError, message, bgColor) => {
    // show message in an asynchronous manner
    const messageToast = document.querySelector('#message-toast');

    Promise.resolve()
        .then(() => {
            // show message
            // make classlist into an array
            const classList = messageToast.className.split(' ');

            // if classlist length is not equal to 6 then change the length to 6
            if (classList != 5) {
                // change legth
                classList.length = 5;
                // add/push new class
                classList.push(`${bgColor} show`);
                // convert array to string
                const newClass = classList.toString();
                // replace all commas into space
                const finalClass = newClass.replace(/,/g, ' ');
                // set the message
                document.querySelector('#message-content').textContent = message;
                messageToast.className = finalClass;
            }

            return Promise.resolve();
        })
        .then(() => {
            if (isError != true) {
                setTimeout(() => {
                    // reload the page
                    window.location.reload();
                }, 1000);
            } else {
                setTimeout(() => {
                    // hide the message toast
                    messageToast.classList.remove('show');
                    messageToast.classList.add('hide');
                }, 1800);
            }
        });
};

/* I used "Event Delegation" meaning I only assign one event to the parent element then used it to multiple elements/childs */
document.querySelector('#todo-table-body').addEventListener('click', setInputValue);
document.querySelector('#todo-form').addEventListener('submit', submitForm);
