const Post = require('../models/post');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const models = require('../models');


exports.createPost = (req, res, next) => {
  console.log('début backend');
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;
  console.log(userId)
  // models.User.findById(userId)
  // const postObject = req.body;
  // delete postObject.id;
  const post = new models.Post({
    title: req.body.title,
    contentPost: req.body.contentPost,
    attachment: req.body.attachment,
    likes: 0,
    userId: userId
    // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  console.log(post)
  post.save()
    .then(() => res.status(201).json({ message: 'Post enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.modifyPost = (req, res, next) => {
  const postObject = req.file ?
    {
      ...JSON.parse(req.body.post),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Post.updateOne({ id: req.params.id }, { ...postObject, id: req.params.id })
    .then(() => res.status(200).json({ message: 'Post modifié !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.deletePost = (req, res, next) => {
  Post.findOne({ id: req.params.id })
    .then(post => {
      const filename = post.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Post.deleteOne({ id: req.params.id })
          .then(() => res.status(200).json({ message: 'Post supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};



exports.getAllPosts = (req, res, next) => {
  console.log('get all posts backend')
  // const postList = 
  models.Post.findAll()
    .then((posts) => {
      console.log('-----------------------------valeur de posts apres findAll---------------------------')
      console.log(posts);
      console.log('-----------------------------Avant boucle for---------------------------')
        for (let i = 0; i < posts.length; i++){
        const userId = posts[i].userId;
        models.User.findByPk(userId).then(
          (user) => {
            if (userId == !null) {
              const firstname = user.firstname;
              const lastname = user.lastname;
              console.log(firstname);
              console.log(lastname);
              posts[i].dataValues.authorFirstName = firstname;
              posts[i].dataValues.authorLastName = lastname;
              // return res.status(404).send(new Error('User not found!'));
            } else {
              posts[i].dataValues.authorFirstName = 'Mr/Mme';
              posts[i].dataValues.authorLastName = 'Anonyme';
              console.log('anonyme');
            }
            
            console.log(posts[i]);
            if (i == posts.length-1)
            {
                
              console.log('-----------------------------fin de la boucle for---------------------------')
              console.log(posts)
              console.log('-----------------------------apres posts, juste avant renvoi de posts vers le frontend----------------------------')
              res.status(200).json(posts)
            }
          } 
        ).catch(
          () => {
            res.status(500).send(new Error('Database error!'));
          })
      }
      
    })
   
    .catch((error) => {
      console.log('erreur catch final')
      res.status(400).json({error: error});
    });
    
};

// ORIGINAL
// exports.getAllPosts = (req, res, next) => {
//   console.log('get all posts backend')
//   models.Post.findAll()
//   .then((posts) => {res.status(200).json(posts);})
//   .catch((error) => {res.status(400).json({error: error});
//     });
// };

exports.getOnePost = (req, res, next) => {
  models.Post.findOne({id: req.params.id})
    .then((post) => {return res.status(200).json(post);
    })
    .catch((error) => {return res.status(404).json({error: error});
    });
};


exports.likePost = (req, res, next) => {
  const like = req.body.like;
  const currentUserId = req.body.userId;
  const postId = req.params.id;
  models.Post.findOne({ id: postId })
    .then(post => {
      if(!(post.usersLiked.includes(currentUserId) || sauce.usersDisliked.includes(currentUserId))){ // si l'utilisateur n'a pas encore donné son avis: l'id de l'utilisateur n'existe pas dans la liste usersLiked ou usersDisliked de la sauce
        if(like == 1){ // si il aime la sauce
          Post.updateOne({ id: postId }, { 
            $inc: { likes: 1 }, // incrementer la valeur de likes
            $addToSet: { usersLiked: currentUserId }, // ajouter son userId dans la liste de usersLiked
          })
          .then(() => res.status(201).json({ message: 'Post liké !'}))
          .catch(error => res.status(400).json({ error }));
        }
        else if(like == -1){ // s'il aime pas le post
          models.Post.updateOne({ id: postId }, {
            $inc: { dislikes: 1 }, // incrementer la valeur de dislikes
            $addToSet: { usersDisliked: currentUserId }, // ajouter son userId dans la liste de usersDisliked
          })
          .then(() => res.status(201).json({ message: 'Like annulé !'}))
          .catch(error => res.status(400).json({ error }));
        }
      } else if(like == 0) { // si l'utilisatuer annule son avis
        if(post.usersLiked.includes(currentUserId)){ // si l'avis précédent était positif
          models.Post.updateOne({ _id: postId }, {
            $inc: { likes: -1 }, // la valeur de likes est disminuée d'1
            $pull: { usersLiked: currentUserId }, // et on efface son userId de la liste de usersLiked
          })
          .then(() => res.status(201).json({ message: 'like annulé !'}))
          .catch(error => res.status(400).json({ error }));   
        }
        if(post.usersDisliked.includes(currentUserId)){ // si l'avis précédent était négatif
          models.Post.updateOne({ id: postId }, {
            $inc: { dislikes: -1 }, /// la valeur de dislikes est disminuée d'1
            $pull: { usersDisliked: currentUserId }, // et on efface son userId de la liste de usersDisliked
          })
          .then(() => res.status(201).json({ message: 'Non like annulé !'}))
          .catch(error => res.status(400).json({ error }));   
        }
      } 
    })
    .catch(error => res.status(400).json({ error }));
};