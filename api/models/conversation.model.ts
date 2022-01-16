export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const conversation = new Schema({
    members: {
        type: Array,
      },
},
{ timestamps: true }
);
module.exports = mongoose.model('conversation', conversation);