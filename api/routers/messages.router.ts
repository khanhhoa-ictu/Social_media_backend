export {};
const message_controller = require('../controllers/message.controller');

module.exports = (app : any) => {
    app.route('/message/')
    .post(message_controller.createMessage);

    app.route('/message/:id')
    .get(message_controller.getMessageUser);

}