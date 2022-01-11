export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    email: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "can't be blank"]
    },
    address: {
        type: String
    },
    phone_number: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: "",
      },
    coverPicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    is_verify: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 50,
    },
    gender:{
        type: String,
    },
    token:{
        type: String,
    }
},
{ timestamps: true }
);
module.exports = mongoose.model('user', user);