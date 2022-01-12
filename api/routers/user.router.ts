export {};
const user_controller = require('../controllers/user.controller');
const auth = require('../utils/auth');

module.exports = (app:any) => {
    app.route('/user/register')
    .post(user_controller.register);

    app.route('/user/verify/:token')
    .get(user_controller.verifyAccount);

    app.route('/user/login')
    .post(user_controller.login);

    app.route('/user/request/forgotpassword/:email')
    .get(user_controller.requestForgotPassword)

    app.route('/user/verify/forgotpassword')
    .post(user_controller.verifyForgotPassword)

    app.route('/user/forgotpassword')
    .post(user_controller.forgotPassword)

    app.route('/auth')
    .post(auth.verify)

    app.route('/user/updateinfor')
    .post(user_controller.updateInfor)

    app.route('/user/updatepassword')
    .post(user_controller.updatePassword)

    app.route('/user/delete')
    .post(user_controller.deleteUser)

    app.route('/user/:name/follower')
    .post(user_controller.followerUser)

    app.route('/user/friendsuggestion/:userId')
    .get(user_controller.getFriendSuggestion)

    app.route('/user/getuser')
    .post(user_controller.getUser)
}