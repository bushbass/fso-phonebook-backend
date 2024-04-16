require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/personsModel')
const mongoose = require('mongoose')


const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)



app.use(express.static('dist'))

app.use(cors())
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
        "number": "39-23-6423122!"
    }
]

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/info', (req, res) => {
    const timestamp = new Date().toString()
    Person.find({}).then(people => {
        // res.json(people)
        res.send(`Phonebook has info for ${people.length} people<br/>${timestamp}`)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})



app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            }
            else {
                res.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (req, res, next) => {

    if (!req.body.name) {
        return res.status(400).send({ error: 'name field must not be blank' })
    }
    if (!req.body.number) {
        return res.status(400).send({ error: 'number field must not be blank' })
    }

    if (Person.find({ name: req.body.name }) === req.body.name) {
        const person = {
            name: req.body.name,
            number: req.body.number
        }
        Person.findOneAndUpdate({ name: req.body.name }, person, { new: true })
            .then(updatedPerson => res.json(updatedPerson))
            .catch(error => next(error)
            )
    }

    else {
        const person = new Person({
            name: req.body.name,
            number: req.body.number
        })

        person.save().then(savedPerson => {
            res.json(savedPerson)
        })
            .catch(error => next(error))
    }

})

app.delete('/api/persons/:id', (req, res) => {
    // persons = persons.filter(person => person.id !== Number(req.params.id))
    // res.status(204).end()
    Person.findByIdAndDelete(req.params.id).then(person =>
        res.json(person))

})

app.put('/api/persons/:id', (req, res, next) => {

    const person = {
        name: req.body.name,
        number: req.body.number

    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error)
        )


})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`connected to ${PORT}`))


