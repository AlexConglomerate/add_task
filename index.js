const express = require('express')
const path = require('path')
const {addNote, getNotes, removeNote, editNote, printNotes} = require('./notes.controller')
const yargs = require('yargs')
const pkg = require('./package.json')

// ░░░░░░░░░░░░░░░ "КОНФИГУРАЦИЯ СЕРВЕРА" ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
const port = 3000  // Указываем порт
const app = express()  // Создаем экземпляр express
app.set('views', 'pages') // Указываем название папки, где лежит файл, который нужно открыть (по дефолту 'views'. Поэтому меняем на 'pages')
app.set('view engine', 'ejs') // Переопределяем базовые настройки. Задаем шаблонизатор ejs
app.use(express.urlencoded({extended: true})) // Добавляем парсер входящих данных (middleware)
app.use(express.json()) // Добавляем парсер входящих JSON данных (middleware)
app.use(express.static(path.resolve(__dirname, 'public'))) // Подключаем файл app.js, который лежит в папке public


// ░░░░░░░░░░░░░░░ ОБРАБОТКА ЗАПРОСОВ С КЛИЕНТА ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

// Обрабатываем запрос на страницу '/' с методом GET. Т.е. когда пользователь просто зашёл на главную страницу
app.get('/', async (req, res) => {
    res.render('index', { // index - название файла, который нужно отрендерить.
        // Объявляем переменные для ejs файла.
        title: 'Express App', // в ejs '<%= title %>' заменится на 'Express App'
        notes: await getNotes(),
        created: false
    })
})
// Обрабатываем запрос на страницу '/' с методом POST. Т.е. когда пользователь заполнил форму, отправил нам что-то
app.post('/', async (req, res) => {
    console.log(`res.body`, req.body) // Так в консоли отразим, какие данные приняли с сервера
    await addNote(req.body.title) // Добавляем в нашу «БД» || title - значение параметра name в input, откуда пришли данные
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: true
    })
})

// Обрабатываем запрос на страницу '/:id' с методом DELETE
app.delete('/:id', async (req, res) => {
    await removeNote(req.params.id)
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: false
    })
})

// Обрабатываем запрос на страницу '/:id' с методом PUT
app.put('/:id', async (req, res) => {
    await editNote(req.params.id, req.body.text)
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: false
    })
})

// ░░░░░░░░░░░░░░░ ЗАПУСК СЕРВЕРА ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
app.listen(port, () => console.log(`Server started`))


// ░░░░░░░░░░░░░░░ КОМАНДЫ КОНСОЛИ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

yargs.version(pkg.version)

yargs.command({
    command: 'add',
    describe: 'add new note to list ',
    builder: {
        title: {
            type: 'string',
            describe: 'note title',
            demandOption: true,
        },
    },
    handler({title}) {
        addNote(title)
    },
})

yargs.command({
    command: 'list',
    describe: 'Print all notes',
    async handler() {
        printNotes()
    },
})

yargs.command({
    command: 'remove',
    describe: 'Remove note by id',
    handler({id}) {
        removeNote(id)
    },
})

yargs.command({
    command: 'edit',
    describe: 'Edit note by id',
    handler({id, title}) {
        editNote(id, title)
    },
})

yargs.parse()
