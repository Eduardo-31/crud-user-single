const express = require('express');
const db = require('./config/db');
const cors = require('cors')
const users = require('./users/usersRouters').router

const app = express()
const PORT= 6000

app.use(cors())
app.use(express.json())

db.authenticate()
  .then(() => console.log('Database authenticated'))
  .catch(err => console.log(err));


db.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log(err))

  app.use('/api/v1/users', users)


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})