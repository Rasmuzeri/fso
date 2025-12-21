import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [input, setInput] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [weather, setWeather] = useState(null)

useEffect(() => {
  // Only fetch weather if exactly one country is shown
  if (countriesToShow.length === 1) {
    const country = countriesToShow[0]
    const [lat, lon] = country.latlng
    
    axios
      .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`)
      .then(response => {
        setWeather(response.data)
      })
  }
}, [input])

  useEffect(() => {
    console.log('fetching countries rates...')
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setAllCountries(response.data)
      })
  }, [])

  const countriesToShow = input === '' 
    ? [] 
    : allCountries.filter(c => 
        c.name.common.toLowerCase().includes(input.toLowerCase())
      )

  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️'
    if (code >= 1 && code <= 3) return '🌤️'
    if (code >= 45 && code <= 48) return '🌫️'
    if (code >= 51 && code <= 67) return '🌧️'
    if (code >= 71 && code <= 77) return '❄️'
    if (code >= 80 && code <= 82) return '🌦️'
    if (code >= 95) return '⛈️'
    return '☁️'
  }

  const renderContent = () => {
    if (countriesToShow.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (countriesToShow.length === 1) {
      const country = countriesToShow[0]
      return (
        <div className="country-card">
          <h1>{country.name.common}</h1>
          <p>Capital {country.capital}</p>
          <p>Area {country.area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(country.languages).map(l => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <img 
            src={country.flags.png} 
            style={{ width: '150px' }} 
          />
          <h2>Weather in {country.capital}</h2>
          {weather ? (
            <>
              <p>Temperature{' '}
                {weather.current.temperature_2m}{' '}
                {weather.current_units.temperature_2m}
              </p>
              <p style={{ fontSize: '80px', margin: '10px 0' }}>{getWeatherEmoji(weather.current.weather_code)}</p>
              <p>Wind {weather.current.wind_speed_10m} {weather.current_units.wind_speed_10m}</p>
            </>
          ) : (
            <p>Loading weather...</p>
          )}
        </div>
      )
    }

    if (countriesToShow.length > 0) {
      return countriesToShow.map(c => (
        <div key={c.cca3} className="country-list-item">
          <span>{c.name.common} </span>
          <button onClick={() => setInput(c.name.common)}>Show</button>
        </div>
      ))
    }

    return null
  }

  return (
    <>
      <div className="app-container">
        <span>Find countries </span>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      {renderContent()}
    </>
  )
}

export default App
