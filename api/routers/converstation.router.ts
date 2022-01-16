export {};
const conversation_controller = require('../controllers/conversation.controller');

module.exports = (app : any) => {
    app.route('/conversation/')
    .post(conversation_controller.createConversation);

    app.route('/conversation/:id')
    .get(conversation_controller.getConversationUser);

}