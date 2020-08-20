const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // tout le monde a le droit d'acceder à notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // on donne l'autorisation de utiliser certaines entete
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // et aussi sur certaines methodes
    next(); // j'appelle next() pour passer au middleware d'apres
});

app.use(bodyParser.json());

// app.use('/images', express.static(path.join(__dirname, 'images')));

// app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

module.exports = app;