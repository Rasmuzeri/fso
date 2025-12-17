import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ setNewFilter }) => {
  return (
    <div>
      filter shown with: <input onChange={(e) => setNewFilter(e.target.value)}/>
    </div>
  )
}

const PersonForm = ({ handleNewNote, setNewName, setNewNumber }) => {
  return (
    <form onSubmit={handleNewNote}>
      <div>
        name: <input onChange={(e) => setNewName(e.target.value)}/>
      </div>
      <div>
        number: <input onChange={(e) => setNewNumber(e.target.value)}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, newFilter }) => {
  return (
    <div>
      {persons
        .filter((person) =>
          person.name.toLowerCase().includes(newFilter.toLowerCase())
        )
        .map((person) => (
          <p key={person.name}>
            {person.name} {person.number}
          </p>
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

  useEffect(() => {
    axios.get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => console.error("Error fetching data:", error))
  }, [])

  const handleNewNote = (e) => {
    e.preventDefault()

    const isNameHere = persons.some((person) => person.name === newName)

    isNameHere
      ? alert(`${newName} is already added to phonebook`)
      : setPersons((prevPersons) => [...prevPersons,
        {name: newName, number: newNumber}])
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter setNewFilter={setNewFilter}/>
      <h3>Add a new</h3>
      <PersonForm
        handleNewNote={handleNewNote}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        newFilter={newFilter}
      />
    </div>
  )

}

export default App