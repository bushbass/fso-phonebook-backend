const express = require('express')
const app = express()

const persons = [
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

const PORT = 3001
app.listen(PORT, () => console.log(`connected to ${PORT}`))

