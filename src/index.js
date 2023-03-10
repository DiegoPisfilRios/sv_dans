const app = require('./app')
app.listen(app.get('port'))

// Environment
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

// Database
require('./db')

// Routers
app.use('/api/product', require('./routers/product.router'))
app.use('/api/sale', require('./routers/sale.router'))
app.use('/api/cart', require('./routers/cart.router'))
app.use('/api/user', require('./routers/user.router'))
app.get('/api', (req, res) => {
    res.json({ message: 'Hola esta es la API.' })
});

app.use('/', require('./routers/views'))

app.use(function (req, res, next) {
	res.status(404).send({ msg: 'Esta ruta no Existe.' });
})