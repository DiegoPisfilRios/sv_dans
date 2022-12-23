const app = require('./app')
app.listen(app.get('port'))

// Environment
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

// Database
require('./db')

// Routers
app.use('/product', require('./routers/products.router'))

app.get('/', (req, res) => {
    res.json({ msg: 'Hola :P'})
})

app.use(function (req, res, next) {
	res.status(404).send({ msg: 'Esta ruta no Existe.' });
})