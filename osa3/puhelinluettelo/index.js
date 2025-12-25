require('dotenv').config()
const express = require('express')
const Person = require('./mongo')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    // Faster and uses less memory than fetching every person just for length
    Person.countDocuments({})
        .then(count => {
            response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  // Mongoose provides a clean method: findById
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        // If the id is formatted correctly but doesn't exist
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // Pass to centralized errorHandler
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
        if (result) {
        response.status(204).end()
        } else {
        response.status(404).end() // Formatted correctly but didn't exist
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({ error: 'Person already exists' })
            }

            const person = new Person({
                name: body.name,
                number: body.number
            })

            // Return the promise so the next .then handles it
            return person.save()
        })
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        number: body.number // We are only allowed to change the number
    }

    // Use new: true because by default we would return the outdated person
    Person.findByIdAndUpdate(request.params.id, person,
        { new: true, runValidators: true, context: 'query' }) // With post, .save handles validators automatically
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                // ID formatted correctly but the person didn't exist
                response.status(404).end()
            }
        })
        .catch(error => next(error)) // CastError (bad ID) to middleware
})

// Catch-all for non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Centralized error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    // This handles the error from person.save()
    return response.status(400).json({ error: error.message })
  }

  // Instead of next(error), send a clean JSON response
  return response.status(500).json({ error: "Something went wrong on our end" })
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001 // fallback
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})