const express = require('express')
var exphbs = require('express-handlebars');
var path = require('path');
var cors = require('cors')
const morgan = require('morgan')

const app = express();
var hbs = exphbs.create({ /* config */ });

app.use(cors());
app.use(morgan('dev'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => {
    res.render('home');
});



app.set('port', process.env.PORT || 4000)

module.exports = app