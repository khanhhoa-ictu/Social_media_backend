import { Request, Response } from 'express';

const Conversation = require("../models/conversation.model");

exports.createConversation = async (req : Request, res :Response) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
    
      try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
      } catch (err) {
        res.status(500).json(err);
      }
}

exports.getConversationUser = async (req:Request, res:Response) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    console.log('aaaaaaaaaaaaaaaaaaaa',conversation);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
}