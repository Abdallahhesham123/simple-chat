import {Router} from 'express'
import * as userController from  './controller/user.js'
import { AuthUser, roles } from '../../middleware/auth.js';
import { validation } from '../../middleware/validation.js';
import {  updateSchema ,headersSchema, profilePic ,friendRequest ,friendRequestparams } from "./crudValidationuser.js";
// import { fileupload, fileValidation } from '../../utils/multer.js';
import { fileupload, fileValidation } from '../../utils/cloudMulter.js';
const router = Router();

router.get("/" ,AuthUser([roles.user]), userController.getUser)
router.get("/getProfile" ,  AuthUser([roles.user]),userController.getProfile)

//update user
router.
put("/findByIdAndUpdate"
 ,fileupload(fileValidation.image)
 .single("image")
,validation(updateSchema),
 AuthUser([roles.user]),userController.findByIdAndUpdate)

//delete user
router.delete("/findOneAndDelete" ,
 validation(headersSchema),AuthUser([roles.user]),
  userController.findOneAndDelete)
//soft-delete
router.put("/softDelete" , AuthUser([roles.user]),userController.softDelete)
router.put("/restoretodatabase" , AuthUser([roles.admin]),userController.restoretodatabase)
router.put("/logout" , AuthUser([roles.user]),userController.logout)



//friend request
router.post('/friend-requests',AuthUser([roles.user]),validation(friendRequest),userController.friendRequest)
// Accept a friend request
router.put('/friend-requests/:id/accept',AuthUser([roles.user]),validation(friendRequestparams),userController.acceptfriendRequest)
// un friend request
router.put('/friend-requests/:id/unfriend',AuthUser([roles.user]),validation(friendRequestparams),userController.unfriendRequest)
//Rejected friend request
router.put('/friend-requests/:id/reject', AuthUser([roles.user]),validation(friendRequestparams),userController.rejectfriendRequest);

//get pending request friend to show it

// Get pending friend requests
router.get('/friend-requests/pending',AuthUser([roles.user]),userController.PendingRequest );





router.get("/allfriendspost" ,  AuthUser([roles.user]), userController.friendsPost)

export default  router