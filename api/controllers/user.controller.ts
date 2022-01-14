
const user = require('../models/user.model');
const nodemailer = require('../utils/nodemailer');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otp = require('../utils/otp');
var cloudinary = require('cloudinary').v2;
var uploads = {};
cloudinary.config({
    cloud_name: 'ilike',
    api_key: '678772438397898',
    api_secret: 'zvdEWEfrF38a2dLOtVp-3BulMno'
});

import {initUser} from './../../type/userType'

exports.register = async (req:any, res:any) => {
    if ((typeof req.body.email === 'undefined')
        || (typeof req.body.password === 'undefined')
        || (typeof req.body.name === 'undefined')
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { email, password, name} = req.body;

    if (email.indexOf("@")=== -1 && email.indexOf('.') === -1 
        || password.length < 6 ){
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let userFind = null;
    try {
        userFind = await user.find({ 'email': email });
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    if (userFind.length > 0) {
        res.status(409).json({ msg: 'Email already exist' }); 
        return;
    }
    const token = randomstring.generate();
    let sendEmail = await nodemailer.sendEmail(email, token);
    if (!sendEmail) {
        res.status(500).json({ msg: 'Send email fail' });
        return;
    }
    
    password = bcrypt.hashSync(password, 10);
    const newUser = new user({
        ...initUser,
        email: email,
        password: password,
        name: name,
        token: token,
    });
    try {
        await newUser.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success' })
}

exports.verifyAccount = async (req:any, res:any) => {
    if(typeof req.params.token === 'undefined'){
        res.status(402).json({msg: "!invalid"});
        return;
    }
    let token = req.params.token;
    let tokenFind = null;
    try{
        tokenFind = await user.findOne({'token': token});
    }
    catch(err){
        res.status(500).json({msg: err});
        return;
    }
    if(tokenFind == null){
        res.status(404).json({msg: "not found!!!"});
        return;
    }
    try{
        await user.findByIdAndUpdate(tokenFind._id ,
            { $set: { is_verify: true }}, { new: true });
    }
    catch(err){
        res.status(500).json({msg: err});
        return;
    }
    res.status(200).json({msg:"success!"});
}

exports.login = async (req:any, res:any) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.password == 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
  

    let { email, password } = req.body;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }

    if(!userFind.is_verify){
        res.status(401).json({msg: 'no_registration_confirmation'});
        return;
    }
    
    if(!bcrypt.compareSync(password, userFind.password)){
        res.status(422).json({msg: 'Invalid data'});
        return;
    }
    let token = jwt.sign({email: email,  iat: Math.floor(Date.now() / 1000) - 60 * 30}, 'shhhhh');
    res.status(200).json({msg: 'success', token: token, user: {
        email:  userFind.email,
        name: userFind.name,
        address: userFind.address,
        phone_number: userFind.phone_number,
        profilePicture: userFind.profilePicture,
        coverPicture: userFind.coverPicture,
        followers: userFind.followers,
        followings:userFind.followings,
        desc: userFind.desc,
        gender:userFind.gender,
    }});
}

exports.requestForgotPassword = async (req:any, res:any) => {
    if(typeof req.params.email === 'undefined'){
        res.json({msg: "Invalid data"});
        return;
    }   
    let email = req.params.email;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null) {
        res.status(422).json({msg: "Invalid data"});
    }
    if(!userFind.is_verify){
        res.status(401).json({msg: 'no_registration_confirmation'});
        return;
    }
    let token = otp.generateOTP();
    let sendEmail = await nodemailer.sendEmailForgotPassword(email, token);
    if (!sendEmail) {
        res.status(500).json({ msg: 'Send email fail' });
        return;
    }   
    userFind.token = token;
    try {
        await userFind.save();
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success', email: email })
}

exports.verifyForgotPassword = async (req:any, res:any) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.otp === 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }

    let { email, otp } = req.body;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    if(userFind.token != otp) {
        res.status(422).json({msg: "OTP fail"});
        return;
    }
    res.status(200).json({msg: "success", otp: otp});
}

exports.forgotPassword = async (req:any, res:any) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.otp === 'undefined'
    || typeof req.body.newPassword === 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let { email, otp, newPassword } = req.body;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    if(userFind.token != otp) {
        res.status(422).json({msg: "OTP fail"});
        return;
    }

    userFind.password = bcrypt.hashSync(newPassword, 10);
    try {
        await userFind.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success' })
}


exports.updateInfor = async (req:any, res:any) => {
    if ( typeof req.body.name === 'undefined'
        || typeof req.body.desc === 'undefined'
        || typeof req.body.address === 'undefined'
        || typeof req.body.phone_number === 'undefined'
        || typeof req.body.email === 'undefined'
        || typeof req.body.gender === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { email, name, desc, address, phone_number,gender,} = req.body;
    let userFind
    try {
        userFind = await user.findOne({'email': email})
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    if(userFind === null) {
        res.status(422).json({ msg: "not found" });
        return;
    }
    userFind.name = name;
    userFind.address = address;
    userFind.phone_number = phone_number
    userFind.gender = gender
    userFind.desc = desc;

    try {
        await userFind.save()
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    let token = jwt.sign({email: email}, 'shhhhh');
    res.status(200).json({msg: 'success', token: token, user: {
        email: userFind.email,
        name: userFind.name,
        coverPicture: userFind.coverPicture,
        desc: userFind.desc,
        address: userFind.address,
        phone_number: userFind.phone_number,
        id: userFind._id,
        gender: userFind.gender,
    }});
}

exports.updatePassword = async (req:any, res:any) => {
    if ( typeof req.body.oldpassword === 'undefined'
        || typeof req.body.newpassword === 'undefined'
        || typeof req.body.email === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { email, oldpassword, newpassword } = req.body;

    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    if(!bcrypt.compareSync(oldpassword, userFind.password)){
        res.status(422).json({msg: 'Invalid data'});
        return;
    }
    userFind.password = bcrypt.hashSync(newpassword, 10);
    try {
        await userFind.save()
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    res.status(200).json({msg: 'success'});
}

exports.deleteUser = async (req:any, res:any) => {
    if (typeof req.body.email === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let userFind;
    try {
        userFind = await user.findOne({'email': req.body.email})
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    userFind.remove();
    res.status(200).json({ msg: 'success'});
}
exports.followerUser = async (req:any, res:any) => {
    if (req.body.name !== req.params.name) {
        try {
          const userFollower = await user.findOne({'name': req.params.name});
          const currentUser = await user.findOne({'name': req.body.name});
          console.log(userFollower);
          console.log(currentUser);
          if (!userFollower.followers.includes(currentUser._id)) {
            await userFollower.updateOne({ $push: { followers: currentUser._id } });
            await currentUser.updateOne({ $push: { followings: userFollower._id} });
            res.status(200).json("user has been followed");
          } else {
            res.status(403).json("you allready follow this user");
          }
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(403).json("you cant follow yourself");
      }
}

exports.getFriendSuggestion = async (req:any, res:any)=>{
    if (typeof  req.params.userId === 'undefined') {
    res.status(422).json({ msg: 'Invalid data' });
    return;
}
user.findOne({ _id: req.params.userId }, (err:any, docs:any) => {
    if (err) {
      res.status(500).json({ msg: err });
      return;
    }
    res.status(200).json({ data: docs.followings });
  });
}
exports.requestForgotPassword = async (req:any, res:any) => {
    if(typeof req.params.email === 'undefined'){
        res.json({msg: "Invalid data"});
        return;
    }   
    let email = req.params.email;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null) {
        res.status(422).json({msg: "Invalid data"});
    }
    if(!userFind.is_verify){
        res.status(401).json({msg: 'no_registration_confirmation'});
        return;
    }
    let token = otp.generateOTP();
    let sendEmail = await nodemailer.sendEmailForgotPassword(email, token);
    if (!sendEmail) {
        res.status(500).json({ msg: 'Send email fail' });
        return;
    }   
    userFind.token = token;
    try {
        await userFind.save();
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success', email: email })
}

exports.verifyForgotPassword = async (req:any, res:any) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.otp === 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }

    let { email, otp } = req.body;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    if(userFind.token != otp) {
        res.status(422).json({msg: "OTP fail"});
        return;
    }
    res.status(200).json({msg: "success", otp: otp});
}

exports.forgotPassword = async (req:any, res:any) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.otp === 'undefined'
    || typeof req.body.newPassword === 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let { email, otp, newPassword } = req.body;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    if(userFind.token != otp) {
        res.status(422).json({msg: "OTP fail"});
        return;
    }

    userFind.password = bcrypt.hashSync(newPassword, 10);
    try {
        await userFind.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success' })
}

exports.getUser = async (req:any, res:any) => {
    const email = req.body.email;
    try {
      const User = await user.findOne({ 'email': email });
      const { createdAt, is_verify,password,token,updatedAt,__v,  ...other } = User._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
};

exports.getUserPost = async (req:any, res:any) => {
    const {userId} = req.params;
    try {
      const User = await user.findOne({ '_id': userId });
      const { createdAt, is_verify,password,token,updatedAt,__v,  ...other } = User._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
};
  

const uploadImg = async (path:any) => {
    let res
    try {
        res = await cloudinary.uploader.upload(path)
    }
    catch(err) {
        console.log(err)
        return false
    }
    return res.secure_url
}

exports.changeAvatar = async (req:any, res:any) => {
    let urlImg = null;

    if(typeof req.file !== 'undefined' ) {
        urlImg = await uploadImg(req.file.path)
    }
    if(urlImg !== null) {
        if(urlImg === false) {
            res.status(500).json({msg: 'server error'});
            return;
        }
    }
    const User = await user.findOne({ 'email': req.body.email });
    User.coverPicture = urlImg;
    try {
        await User.save();
        res.status(200).json({ msg: 'success', data: User });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
}
