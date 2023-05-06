import messageModel from "../../../../DB/model/Message.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const getMessageModule =  asyncHandler(async (req, res, next) => {


    const { from, to } = req.body;

    const messages = await messageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });


    return res.json({ message: "Done"  ,projectedMessages})
})

export const sendMessage =  asyncHandler(async (req, res, next) => {


    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if(data){

        return res.status(201).json({ message: "Message added successfully"  })
    }else{

        return res.status(404).json({ msg: "Failed to add message to the database" });
    }

    
})