
import { apiCaller } from '../src/client/js/call-apis'
const dotenv = require('dotenv')
dotenv.config()
// Note: update jest with "jest --setupFiles dotenv/config" else test won't work

describe("When we call apis with valid data", () => {

    it("then it should return valid response", async () => {
        const apiData = {
            userData: {
                departureDate: "2021-06-05",
                destinationCity: "Toronto",
                returnDate: "2021-06-9",
                timeUntilReturn: 4,
                timeUntilTrip: 0,
                tripDuration: 4,
                units: "M"
            }
        }
        const response = await apiCaller('/geonames', apiData)
        console.log(response)
        expect(response.geonames[0].countryName).toBe('Canada')
    })

})