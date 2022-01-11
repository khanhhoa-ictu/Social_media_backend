export {};
const post_controller = require('../controllers/post.controller');
module.exports = (app : any) => {
    app.route('/post/create')
    .post(post_controller.createPost);

    app.route('/post/update')
    .post(post_controller.updatePost);
    
    app.route('/post/delete/:idPost')
    .delete(post_controller.deletePost);
    
    app.route('/post/like/:idPost')
    .post(post_controller.likePost);
    
    app.route('/post/detail/:idPost')
    .get(post_controller.detailPost);
    
    app.route('/profile/:name')
    .get(post_controller.listPostProfile);
}