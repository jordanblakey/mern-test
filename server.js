const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const items = require('./routes/api/items')

const app = express()

// Bodyparser Middleware
app.use(bodyParser.json())

// DB Config
if (process.env.NODE_ENV === 'production') {
  const db = process.env.MONGO_URI
} else {
  const db = require('./config/keys').mongo.connect
}

// Connect to Mongo
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('MongoDB Connected...')
  })
  .catch(err => console.error(err))

// Use Routes
app.use('/api/items', items)

// Serve static assets
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/biuld'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
