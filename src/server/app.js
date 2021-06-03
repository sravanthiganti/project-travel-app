// https://zellwk.com/blog/endpoint-testing/
//
const app = require('./server')

const port = process.env.PORT || 8081;

app.listen(port,
    () => console.log(`Travel weather app is listening on port ${port}!`)
)

