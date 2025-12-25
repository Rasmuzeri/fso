import { useState, useEffect } from 'react'
import personService from './services/personService'
import Notification from './Components/Notification'

const Filter = ({ setNewFilter }) => {
  return (
    <div>
      filter shown with: <input onChange={(e) => setNewFilter(e.target.value)}/>
    </div>
  )
}

const PersonForm = ({ handleNewPerson, newName, setNewName, newNumber, setNewNumber }) => {
  return (
    <form onSubmit={handleNewPerson}>
      <div>
        name: <input value={newName} onChange={(e) => setNewName(e.target.value)}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, newFilter, deletePerson }) => {
  return (
    <div>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        )
        .map((person) => (
          <div key={person.name}>
            <p>
              {person.name} {person.number}
            </p>
            <button onClick={() => deletePerson(person.id, person.name)}>
                delete
            </button>
          </div>
        ))
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const handleNewPerson = (e) => {
    e.preventDefault()

    const isNameHere = persons.some((person) => person.name === newName)

    if (isNameHere) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name == newName)
        const changedPerson = { ...person, number: newNumber }
        
        personService
          .replace(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(prevPersons => 
              prevPersons.map(p => p.id !== person.id ? p : returnedPerson)
            )
            setSuccessMessage({
              text: `Changed ${returnedPerson.name}`,
              type: 'success'
            })
            setTimeout(() => setSuccessMessage(null), 5000)

            // Reset the states
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setPersons(persons.filter(p => p.id !== person.id))

            setSuccessMessage({
              text: `Information of ${person.name} has already been removed from the server`,
              type: 'error'
            })
            setTimeout(() => setSuccessMessage(null), 5000)
          })
      }
    } else {
      const newObject = { name: newName, number: newNumber };

      personService
        .create(newObject)
        .then(returnedPerson => {
          // Use the server's data to update the state since the server automatically adds the id
          setPersons(prevPersons => [...prevPersons, returnedPerson]);

          setSuccessMessage({
            text: `Added ${returnedPerson.name}`,
            type: 'success'
          })
          setTimeout(() => setSuccessMessage(null), 5000)

          // Reset the states
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setSuccessMessage({
            text: error.response.data.error,
            type: 'error'
          })
          setTimeout(() => setSuccessMessage(null), 5000)
        });
      }
  }

const deletePerson = (id, name) => {
  if (window.confirm(`Delete ${name}?`)) {
    personService
      .remove(id)
      .then(() => {
        // Success! Now remove from local state
        setPersons(prevPersons => prevPersons.filter(p => p.id !== id))

        setSuccessMessage({
          text: `Deleted ${name}`,
          type: 'success'
        })
        setTimeout(() => setSuccessMessage(null), 5000)
      })
      .catch(error => {
        // Clean up local state anyway since it's gone from the server
        setPersons(prevPersons => prevPersons.filter(p => p.id !== id))

        setSuccessMessage({
          text: `Information of ${name} has already been removed from the server`,
          type: 'error'
        })
        setTimeout(() => setSuccessMessage(null), 5000)
      })
  }
}
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Filter setNewFilter={setNewFilter}/>
      <h3>Add a new</h3>
      <PersonForm
        handleNewPerson={handleNewPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        newFilter={newFilter}
        deletePerson={deletePerson}
      />
    </div>
  )

}

export default App