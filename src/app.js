const express = require('express')
var cors = require('cors')
const morgan = require('morgan')

const app = express();

app.use(cors());
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(express.static('public'));


app.set('port', process.env.PORT || 4000)

module.exports = app