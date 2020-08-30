const jwt = require('jsonwebtoken');
const models = require('../models');


exports.createPost = (req, res, next) => {
    console.log('début backend');
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const post = new models.Post({
        title: req.body.title,
        contentPost: req.body.contentPost,
        // attachment: req.body.attachment,
        attachment: req.file ? req.file.filename : null,
        likes: 0,
        userId: userId
        // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    post.save()
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
            // const filename = post.imageUrl.split('/images/')[1];
            // fs.unlink(`images/${filename}`, () => {
            models.Post.destroy({where: {id: req.params.id}})
                .then(() => res.status(200).json({message: 'Post supprimé !'}))
                .catch(error => res.status(400).json({error}));
            // });
        })
        .catch(error => res.status(500).json({error}));
};


exports.getAllPosts = (req, res, next) => {
    // console.log('get all posts backend');
    // const postList =
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
    const postId = parseInt(req.params.id)
    models.Post.findByPk(postId)
        .then((post) => {
            // console.log(post)
            return res.status(200).json(post);
        })
        .catch((error) => {
            return res.status(404).json({error: error});
        });
};


exports.likePost = (req, res, next) => {
    console.log('début like post')

    // récupération de l'Id de l'utilisateur
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const postId = req.params.id;

    models.Post.findOne({
        where: {id: postId},
        include: [{
            model: models.Like,
            where: {userId}
        }]
    }) // /!\ fausse instruction pour garder la structure '.then(...)' sans qu'il y ait d'erreur à cause de l'absence de la table Like --> a supprimer plus tard
        .then(foundLike => {
            return models.Post.findOne({
                where: {id: postId}
            }).then((post) => {
                if (!foundLike) {
                    return post.addUser(userId)
                } else {
                    return post.removeUser(userId)
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
