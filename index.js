const app =  require('./app')
const config = require('./utils/configs')
const PORT = config.PORT

app.listen(PORT, () => {
  // console.log(`Server running at ${PORT}`)
})