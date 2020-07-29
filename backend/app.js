const express = require('express')
const app = express()
const {Sequelize} = require('sequelize');
require('dotenv').config()

const User = require('./models/user')

const sequelize = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)


try {
    sequelize.authenticate().then(() => {
        User(sequelize)
        sequelize.sync()


    });
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // tout le monde a le droit d'acceder à notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // on donne l'autorisation de utiliser certaines entete
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // et aussi sur certaines methodes
    next(); // j'appelle next() pour passer au middleware d'apres
});


app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.get('/api/status', function (req, res) {
    res.send({status: 'ok'})
})

app.post('/user', function (req, res) {
    const user = sequelize.models.User
    user.create(
        {firstName: 'Claudia', lastName: 'Claudia', email: new Email(), password: new Password()},
        {fields: ['firstName', 'lastName', 'email', 'password']}).then((res) => {
        res.status(201)
    }).catch(() => {
        res.status(401)
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
