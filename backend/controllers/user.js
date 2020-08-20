const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const models = require('../models');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new models.User({
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email,
            password: hash
        })

        user.save()
          .then(() => res.status(201).json({
              user,
              token: jwt.sign(
                  {userId: user.id},
                  'RANDOM_TOKEN_SECRET',
                  {expiresIn: '24h'}
              )
          }))
          .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({error}));
};


exports.login = (req, res, next) => {
    models.User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    auth: 'Succes',
                    userId: user.id,
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


// il faut que ca renvoie un objet user tel que:
// {firstname: 'firstname', lastname: 'lastname'};
// exports.userData = (req, res, next) => {
    
//     .then(hash => {
//         const user = new models.User({
//             lastname: req.body.lastname,
//             firstname: req.body.firstname,
//         })
//         user.save()
//           .then(() => res.status(201).json({
//               user
//               )
//           }))
//           .catch(error => res.status(400).json({ error }));
//     })
//     .catch(error => res.status(500).json({error}));
// };