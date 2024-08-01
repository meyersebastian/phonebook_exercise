app.use(cors())
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()


// var app = express()
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
    const peopleSaved = persons.length
    const now = new Date()
    response.send('<p>Phonebook has info for '+peopleSaved+' people</p><p>'+now+'</p>')
  })
  
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

const generateId = () => {
    const minCeiled = 0
    const maxFloored = 100000000  
    return String(Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled))
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    const persons_values = persons.map((x) => x.name)
    console.log(persons_values)
    if (!body.name|!body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    else if (persons_values.includes(body.name)) {
        return response.status(400).json({ 
            error: 'person already exists' 
          })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })