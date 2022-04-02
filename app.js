if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
const routes = require('./routes')
const PORT = process.env.PORT
require('./config/mongoose')

app.engine('hbs', exphbs({ defaultLayouts: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(PORT, () => {
  console.log(`The app is running on http://localhost:${PORT}`)
})
