const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const models = require('../models');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // appel à la fonction de hachage dans le mot de passe
        .then(hash => {
            const user = new models.User({ // création d'un utilisateur
                lastname: req.body.lastname,
                firstname: req.body.firstname,
                email: req.body.email,
                password: hash
                // userAdmin: false
            })

            user.save() // enregistrement de l'utilisateur dans la base de données
                .then(() => res.status(201).json({
                    user,
                    token: jwt.sign(
                        {userId: user.id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: '24h'}
                    )
                }))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};


exports.login = (req, res, next) => {
    models.User.findOne({where: {email: req.body.email}, attributes: ['id', 'password']}) // Vérification que l'email est dans la base de données
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'}); // s'il ne trouve pas, renvoie une erreur d'authentification
            }
            bcrypt.compare(req.body.password, user.password) // on compare le mot de passe entrée par l'utilisateur avec le hash et celui qui est enregistré dans la base de données
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'}); // s'ils ne correspondent pas, renvoie un message d'erreur
                    }
                    res.status(200).json({ // s'ils correspondent, on envoie une réponse de réussite avec l'id de l'utilisateur et un token crypté
                        auth: 'Succes',
                        user: user,
                        token: jwt.sign(
                            {userId: user.id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};


exports.userData = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId; // on recupère le userId du token

    models.User.findByPk(userId, {attributes: ['id', 'firstname', 'lastname', 'email', 'userAdmin']}).then( // on cherche les informations listées pour l'utilisateur
        (user) => {
            if (!user) {
                return res.status(404).send(new Error('User not found!'));
            }
            res.status(200).json(user); // réponse du serveur avec les informations
        }
    ).catch(
        () => {
            res.status(500).send(new Error('Database error!'));
        }
    )
};


exports.modifyProfil = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId; // on recupère le userId du token
    models.User.update({ // mise à jour de lastname, firstname et email dans la base de donnés
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email
        },
        {where: {id: userId}})
        .then(() => res.status(200).json({message: 'Profil modifié !'}))
        .catch(error => res.status(400).json({error}));
};


exports.deleteUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId; // on recupère le userId du token
    models.Post.destroy({where: {userId: userId}}).then( // on supprime les posts créés par l'utilisateur
        () => {
            models.User.destroy({where: {id: userId}}).then( // on supprime l'utilisateur de la base de données
                (user) => {
                    if (!user) {
                        return res.status(404).send(new Error('User not found!'));
                    }
                    res.status(200).json(user);
                }) // fin de user.destroy then
        }) // fin de post.destroy then
        .catch(
            (err) => {
                console.log(err)
                res.status(500).send(new Error('Database error!'));
            }
        )
};