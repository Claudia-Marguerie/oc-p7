const jwt = require('jsonwebtoken');
const models = require('../models');
const fs = require('fs');


exports.createPost = (req, res, next) => {
    console.log('début backend');
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId; // on recupère le userId du token

    const post = new models.Post({ // on crée un nouv objet avec les informations du post
        title: req.body.title,
        contentPost: req.body.contentPost,
        attachment: req.file ? req.file.filename : null,
        likes: 0,
        userId: userId,
    });
    post.save() // on enregistre le post dans la base de données
        .then(() => res.status(201).json({message: 'Post enregistré !'}))
        .catch(error => res.status(400).json({error}));
};


exports.modifyPost = (req, res, next) => {
    const postId = req.params.id;
    const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    models.Post.update({title: postObject.title, contentPost: postObject.contentPost}, {where: {id: postId}})
        .then(() => res.status(200).json({message: 'Post modifié !'}))
        .catch(error => res.status(400).json({error}));
};


exports.deletePost = (req, res, next) => {
    console.log('début backend deletePost')
    models.Post.findOne({where: {id: req.params.id}})
        .then(post => {
            if(post.attachment){
               fs.unlinkSync(`images/${post.attachment}`)
            }
            models.Post.destroy({where: {id: req.params.id}})
                .then(() => res.status(200).json({message: 'Post supprimé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error})
        });
};


exports.getAllPosts = (req, res, next) => {
    models.Post.findAll({
        attributes: ['id', 'title', 'contentPost', 'attachment', 'createdAt', 'updatedAt'],
        include: [
            {
                model: models.User,
                as: 'User',
            },
            {
                model: models.Like,
            }
        ],
        order: [['updatedAt', 'DESC']]
    })
        .then((posts) => {
            res.json(posts)
        })
        .catch((error) => {
            console.log('erreur catch final', error)
            res.status(400).json({error: error});
        });
};


exports.getOnePost = (req, res, next) => {
    const postId = parseInt(req.params.id) // on transforme l'id du post en nombre entier
    models.Post.findByPk(postId) // on recupre le post à partir de son id 
        .then((post) => {
            return res.status(200).json(post); // on renvoie le post vers le frontend
        })
        .catch((error) => {
            return res.status(404).json({error: error});
        });
};


exports.likePost = (req, res, next) => {
    // récupération de l'Id de l'utilisateur
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    // récupération de l'Id du post
    const postId = req.params.id;

    models.Post.findOne({ // on cherche l'id du post ds le tableu Post et Like
        where: {id: postId},
        include: [{
            model: models.Like,
            where: {userId}
        }]
    }) 
        .then(foundLike => {
            return models.Post.findOne({
                where: {id: postId}
            }).then((post) => {
                if (!foundLike) {
                    return post.addUser(userId) // On ajoute l'userId ds le tableau
                } else {
                    return post.removeUser(userId) // On supprime l'userId ds le tableau
                }
            })
        })
        .then(() => {
            return models.Post.findOne({
                where: {id: postId},
                include: [{
                    model: models.Like,
                }]
            })
        })
        .then((post) => {
            res.status(201).json(post)
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({error})
        });
};
