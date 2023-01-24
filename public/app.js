// import {createElement1} from './createElement'
// const {createElement1} = require('./createElement')

const getParams = (event) => {
    const text = event.target.parentNode.parentNode.childNodes[0].textContent.trim()
    const id = event.target.dataset.id
    const elem = event.target.parentNode.parentNode
    return {text, id, elem}
}


const configElement = {
    default: {
        input: false,
        button_1: {color: 'primary', name: "Update", type: "update",},
        button_2: {color: 'danger', name: "✕", type: "remove",}
    },
    edit: {
        input: true,
        button_1: {color: 'success', name: "Save", type: "save",},
        button_2: {color: 'danger', name: "Cancel", type: "cancel",}
    }
}

const makeChange = (event, version) => {
    const {text, id, elem} = getParams(event)
    const li = createElement(text, id, configElement[version])
    elem.replaceWith(li)
}


const createElement = (text, id, {input, button_1, button_2}) => {
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    if (input) {
        const textarea = document.createElement('input');
        textarea.value = text;
        li.appendChild(textarea);
    } else {
        li.appendChild(document.createTextNode(text))
    }

    const div = document.createElement('div');

    const saveBtn = document.createElement('button');
    saveBtn.className = `btn btn-${button_1.color}`
    saveBtn.setAttribute("data-type", button_1.type);
    saveBtn.setAttribute("data-id", id);
    saveBtn.innerHTML = button_1.name;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = `btn btn-${button_2.color}`
    cancelBtn.setAttribute("data-type", button_2.type);
    cancelBtn.setAttribute("data-id", id);
    cancelBtn.innerHTML = button_2.name;

    div.append(saveBtn, cancelBtn);
    li.append(div);

    return li
}


document.addEventListener('click', event => {
    // обработка нажатия на кнопку "Удалить"
    if (event.target.dataset.type === 'remove') {
        const id = event.target.dataset.id
        remove(id).then(() => {
            event.target.closest('li').remove()
        })
    }

    // обработка нажатия на кнопку "Изменить"
    if (event.target.dataset.type === 'update') {
        const element = event.target.parentNode.parentNode.childNodes[0]
        const text = element.textContent.trim()
        const newText = prompt('Enter a new name', text)
        const id = event.target.dataset.id
        if (newText !== null && newText !== text) {
            edit(id, newText).then(() => {
                element.textContent = newText
            })
        }
    }

    // обработка нажатия на кнопку "Сохранить"
    if (event.target.dataset.type === 'save') {
        makeChange(event, 'default')

    }

    // обработка нажатия на кнопку "Отменить"
    if (event.target.dataset.type === 'cancel') {
        makeChange(event, 'default')
    }
})

document.querySelectorAll('.btn-success').addEventListener('click', function () {
    // Получаем родительский элемент li
    let li = this.parentNode.parentNode;
    // Удаляем содержимое элемента li
    li.innerHTML = "";
    console.log(`Удаляем содержимое элемента li`)
});

async function remove(id) {
    await fetch(`/${id}`, {method: 'DELETE'})
}

async function edit(id, text) {
    const options = {
        method: 'PUT',
        body: JSON.stringify({text: text}),
        headers: {'Content-Type': 'application/json'}
    }

    await fetch(`/${id}`, options)
}

