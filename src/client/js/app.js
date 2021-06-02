const countdown = require('countdown')

export const submit = async (event) => {
    // Prevents page reloading when button is clicked
    event.preventDefault()
    console.log('Event listener connected')

    // Initialise error and result fields
    const errorMessage = document.getElementById('error-message')
    errorMessage.innerHTML = ""
    document.getElementById('forecast-card-container').innerHTML = ""
    document.getElementById('how-many-sleeps').innerHTML = ""
    document.getElementById('location-image-container').innerHTML = ""
    document.getElementById('forecast-title').innerHTML = ""

    // Destination city
    const destinationCity = document.getElementById('destination-city').value
    console.log(`City: ${destinationCity}`)
    if (destinationCity == "") {
        errorMessage.innerHTML = "Please enter a destination city"
        return
    }

    // Departure date
    const departureDate = document.getElementById('departure-date').value
    if (departureDate == "") {
        errorMessage.innerHTML = "Please enter a departure date"
        return
    }
    console.log(`Departure date: ${departureDate}`)

    // Return date
    // Not required, will just give full forecast results if left blank
    const returnDate = document.getElementById('return-date').value
    if (returnDate == "") {
        errorMessage.innerHTML = "Please enter a return date"
        return
    }
    console.log(`Return date: ${returnDate}`)

    const timeUntilTrip = getTimeUntilDate(departureDate)
    console.log(`Days until departure: ${timeUntilTrip}`)

    const timeUntilReturn = getTimeUntilDate(returnDate)
    console.log(`Days until return: ${timeUntilReturn}`)

    const tripDuration = timeUntilReturn - timeUntilTrip
    console.log(`Trip duration: ${tripDuration}`)
    if (tripDuration < 0) {
        errorMessage.innerHTML = "Return date can't be before departure date"
        return
    }

    // User can select metric (C, m/s, mm) or imperial units (F, mph, in)
    // For temperature, wind speed and precipitation amount
    const unitsInput = document.querySelector('input[name="units"]:checked').value
    let units = "M"
    if (unitsInput == "imperial") {
        units = "I"
    }

    // Initialise apiData object with user's input and calculations above
    let apiData = {}
    apiData["userData"] = { destinationCity, departureDate, returnDate, timeUntilTrip, timeUntilReturn, tripDuration, units }
    console.log(`api data from app.js is ${apiData}`)

    // Calls the API function, then updates the UI if all connections succeeded
    apiData = await Client.callApis(apiData)
    console.log(`api data after client calls from app.js is ${apiData}`)

    if (apiData != null) {
        Client.updateUI(apiData)

        // data  added to local storage
        localStorage.setItem('apiData', JSON.stringify(apiData))
    }
}

const getTimeUntilDate = (date) => {
    const todayMilliseconds = (new Date()).setHours(1)

    const dateMilliseconds = (new Date(date)).setHours(1)
    const timeUntilDate = countdown(todayMilliseconds, dateMilliseconds, countdown.DAYS).days
    return timeUntilDate
}


export const checkLocalStorage = (event) => {
    if (localStorage.apiData) {
        const apiData = JSON.parse(localStorage.getItem('apiData'))
        Client.updateUI(apiData)
    }
}

export const clearLocalStorage = (event) => {
    localStorage.clear()
    location.reload()
}
