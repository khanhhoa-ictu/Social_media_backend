export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const message = new Schema({
    conversationId: {
        type: String,
      },
      sender: {
        type: String,
      },
      text: {
        type: String,
      },
});
module.exports = mongoose.model('message', message);