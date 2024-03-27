const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/info', (req, res) => {
    const personsLength = persons.length
    const timestamp = new Date().toString()
    res.send(`Phonebook has info for ${personsLength} people<br/>${timestamp}`)
})

app.get('/api/persons', (req, res) => {
    res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === Number(req.params.id))
    console.log({ person })
    if (person) { res.json(person) }
    else { res.status(404).end() }
})

app.post('/api/persons', (req, res) => {

    const person = persons.find((person) => person.name === req.body.name);
    if (person) {
        return res.status(400).send({ error: `user ${person.name} already exists` })
    }

    if (!req.body.name) {
        return res.status(400).send({ error: 'name field must not be blank' })
    }
    if (!req.body.number) {
        return res.status(400).send({ error: 'number field must not be blank' })
    }
    const id = Math.round(Math.random() * Math.random() * 1000000)

    const newPerson = { name: req.body.name, number: req.body.number, id }
    persons = persons.concat(newPerson)
    res.send(persons)

})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== Number(req.params.id))
    res.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => console.log(`connected to ${PORT}`))


