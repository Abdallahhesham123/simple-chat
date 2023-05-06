import {Router} from 'express'
import * as messageController from  './controller/message.js'
const router = Router();


router.post("/getAllMessage" , messageController.getMessageModule)
router.post("/sendMessage" , messageController.sendMessage)
export default  router