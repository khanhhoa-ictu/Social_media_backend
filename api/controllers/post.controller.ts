const post = require('../models/post.model')
const user = require('../models/user.model');
import { initialValue, PostType } from "../../type/postType"

exports.createPost =async (req : any, res :any) => {
    let {userId, desc, img} = req.body;
    if(!userId || !desc || !img){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    const newPost = new post({
        ...initialValue,
        userId : userId,
        desc : desc,
        img : img
    })
    try {
        await newPost.save()
    } catch (error) {
        res.status(500).json({ msg: error });
        return;
    }
    res.status(201).json({ msg: 'success', post : newPost })
}

exports.updatePost =async (req : any, res :any) => {
    let {idPost, desc, img} = req.body;
    if(!idPost || !desc || !img){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let postFind = null;
    try{
        postFind = await post.findOne({'_id': idPost});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(postFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    postFind.desc = desc
    postFind.img = img
    try {
        await postFind.save()
    } catch (error) {
        res.status(500).json({ msg: error });
        return;
    }
    res.status(201).json({ msg: 'success', post : postFind })
}

exports.deletePost =async (req : any, res :any) => {
    let {idPost} = req.params;
    let {userId} = req.body;
    if(!idPost || !userId){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let postFind = null;
    try{
        postFind = await post.findOne({'_id': idPost});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(postFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }

    if(postFind.userId !== userId) {
        res.status(401).json({msg: "Authentication information"});
        return; 
    }

    try {
        await postFind.deleteOne()
    } catch (error) {
        res.status(500).json({ msg: error });
        return;
    }
    res.status(201).json({ msg: 'success', post : postFind })
}

exports.likePost =async (req : any, res :any) => {
    let {idPost} = req.params;
    let {userId} = req.body;
    if(!idPost || !userId){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let postFind = null;
    try{
        postFind = await post.findOne({'_id': idPost});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(postFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }

    if(postFind.likes.includes(userId)){
        let newLikes = postFind.likes.filter((item : string) => item !== userId)
        postFind.likes = newLikes
    }else{
        postFind.likes.push(userId)
    }

    try {
        await postFind.save()
    } catch (error) {
        res.status(500).json({ msg: error });
        return;
    }
    res.status(201).json({ msg: 'success', post : postFind })
}

exports.detailPost =async (req : any, res :any) => {
    let {idPost} = req.params;
    if(!idPost){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let postFind = null;
    try{
        postFind = await post.findOne({'_id': idPost});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(postFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }

    try {
        await postFind
    } catch (error) {
        res.status(500).json({ msg: error });
        return;
    }
    res.status(201).json({ msg: 'success', post : postFind })
}

exports.listPostProfile =async (req : any, res :any) => {
    let {userId} = req.body;
    if(!userId){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let postFind = [];
    try{
        postFind = await post.find({'userId': userId});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(postFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }

    try {
        await postFind
    } catch (error) {
        res.status(500).json({ msg: error });
        return;
    }
    res.status(201).json({ msg: 'success', post : postFind })
}

exports.newsFeed =async (req : any, res :any) => {
    let {userId} = req.params;
    if(!userId){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let userFind : any;
    let listPost : any[]= [];
    try{
        userFind = await user.findOne({'_id': userId});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    userFind.followers.map((item : string) => {
        (async () => {
            let list = []
            list = await post.find({'userId' : item})
            listPost = [...listPost , ...list]
            try {
                await listPost
            } catch (error) {
                res.status(500).json({ msg: error });
                return;
            }
        })()
    })
    setTimeout(() => {
        res.status(201).json({ msg: 'success', list : listPost })
    },1000)
    
}