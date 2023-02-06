const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('=> connected to database MongoDB.');
    })
    .catch((error) => {
        console.log('connection error: ' + error.message);
    })