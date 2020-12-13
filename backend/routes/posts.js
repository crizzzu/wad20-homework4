const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post
    // Not sure of all these should be mandatory or not, you can create post without url or picture - just words
    let createPost = {
        text: {
            required: true
        },
        media: {
            url: {required: true},
            type: {required: true}
        }
    };

    //copied this from users.js
    const fieldMissing = {
        code: null,
        message: 'Please provide %s field'
    };

    for (let field in createPost) {
        if (createPost[field].required === true && !request.body[field]) {
            fieldMissing.code = field;
            fieldMissing.message = fieldMissing.message.replace('%s', field);
            response.json(fieldMissing, 400);
            return;
        }
    };

    let params = {
        userId: request.currentUser.id,
        text: request.body.text,
        media: {
            type: request.body.media.type,
            url: request.body.media.url
        }
    };

    PostModel.create(params, (params) => {
        response.status(201).json(params)
    });

});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
    let postId = request.params.postId;
    let userId = request.currentUser.id;

    PostModel.like(userId, postId, () => {
        response.status(201).json([])
    });
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post
    let postId = request.params.postId;
    let userId = request.currentUser.id;

    PostModel.unlike(userId, postId, () => {
        response.status(201).json([])
    });

});

module.exports = router;
