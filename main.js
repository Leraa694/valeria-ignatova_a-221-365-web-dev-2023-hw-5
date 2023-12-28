'use strict';

let btn = document.querySelector('#create');

function createItem(value){
    const list = document.querySelector(`#${value.select}-list`);
    const item = document.getElementById('task-template').cloneNode(true);
    item.querySelector('.task-name').textContent = value.name;
    item.dataset.id=value.id
    item.querySelector('.task-description').textContent = value.desc;
    item.classList.remove('d-none');
    list.append(item);
}

btn.addEventListener('click', function(event){
    let modal = event.target.closest('.modal');
    let name = modal.querySelector('#nameTask').value;
    console.log(name);
    let desc = modal.querySelector('#textTask').value;
    console.log(desc);
    let select = modal.querySelector('#select').value;
    console.log(select);
    localStorage.setItem(`task-${localStorage.length+1}`,JSON.stringify({name,desc,select}));
    createItem({id:`task-${localStorage.length+1}`,name,desc,select})
});

const showShowModal = document.querySelector('#showModal');
showShowModal.addEventListener('show.bs.modal',showModal)

function showModal(event){
    let task = event.relatedTarget.closest('#task-template');
    let name = task.querySelector('.task-name').textContent;
    let desc = task.querySelector('.task-description').textContent;
    event.target.querySelector('#showNameTask').value = name;
    event.target.querySelector('#showTextTask').value = desc;
};


const showEditModal = document.querySelector('#editModal');
showEditModal.addEventListener('show.bs.modal',editModal)

function editModal(event){
    let task = event.relatedTarget.closest('#task-template');
    let name = task.querySelector('.task-name').textContent;
    let desc = task.querySelector('.task-description').textContent;
    let id = task.dataset.id;
    event.target.querySelector('#editNameTask').value = name;
    event.target.querySelector('#editTextTask').value = desc;
    const btn = event.target.querySelector('#save');
    btn.addEventListener('click', function(event) {
        const modal = event.target.closest('#editModal');
        const item = JSON.parse(localStorage.getItem(id));
        item.name = modal.querySelector('#editNameTask').value;
        item.desc = modal.querySelector('#editTextTask').value;
        localStorage.setItem(id, JSON.stringify(item));
        task.querySelector('.task-name').textContent = item.name;
        task.querySelector('.task-description').textContent = item.desc;
    });  
}

const showRemoveModal = document.querySelector('#removeModal');
showRemoveModal.addEventListener('show.bs.modal',removeModal)

function removeModal(event){
    let task = event.relatedTarget.closest('#task-template');
    let name = task.querySelector('.task-name').textContent;
    let id = task.dataset.id;
    event.target.querySelector('#removeNameTask').textContent= name;
    const btn = event.target.querySelector('#removeModalBtn');
    btn.addEventListener('click', function(event) {
        localStorage.removeItem(id);
        document.querySelector((`[data-id="${id}"]`)).remove();
    });  
}

const API_KEY = '50d2199a-42dc-447d-81ed-d68a443b697e';
const API_URL = 'http://tasks-api.std-900.ist.mospolytech.ru/api/tasks';

const createTask = async (name, desc, status) => {
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, desc, status }),
        });

        if (!response.ok) {
            throw new Error('Failed to create task.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

const updateTask = async (taskId, name, desc, status) => {
    try {
        const response = await fetch(`${API_URL}/${taskId}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, desc, status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update task.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${API_URL}/${taskId}?api_key=${API_KEY}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete task.');
        }
    } catch (error) {
        console.error(error);
    }
};

const loadTasks = async () => {
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`);

        if (!response.ok) {
            throw new Error('Failed to load tasks.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

window.onload = function () {
    
    for (let i = 0; i < localStorage.length; ++i) {
        let key = localStorage.key(i);
        if (key.startsWith('task')) {
            const value = JSON.parse(localStorage.getItem(key));
            createItem({id:key,...value})
        }
    }
};

