export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const post = new Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500,
    },
    name: {
        type: String,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
    comments: {
        type: Array,
        default: [],
    },
},
{ timestamps: true }
);
module.exports = mongoose.model('post', post);