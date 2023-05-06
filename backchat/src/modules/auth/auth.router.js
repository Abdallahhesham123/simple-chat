import {Router} from 'express'
import * as authController from  './controller/auth.js'
import { LoginSchema, resetPassword, sendingemailValidation, signUpSchema ,userPasswordResetGen} from "./ValidationUser.js";
import { validation } from '../../middleware/validation.js';
import { fileupload, fileValidation } from '../../utils/cloudMulter.js';
import { AuthUser, roles} from '../../middleware/auth.js';
// import { endPoint } from './endPoint.auth.js';
const router = Router();


router.get("/" , authController.getAuthModule)
router.post("/register" , fileupload(fileValidation.image)
.single("image"),validation(signUpSchema), authController.register)
router.post("/login" , validation(LoginSchema),authController.login)

router.post("/googleSignIn" ,authController.googleSignIn)
router.post("/facebookSignIn" ,authController.facebookSignIn)
router.post("/GithubSignIn" ,authController.GithubSignIn)


router.post("/verify-email/:otp/:email" , authController.verifyEmail)
router.get("/verification-email/:token" , authController.verifyRefreshEmail)
router.get("/confirmation-email/:token" , authController.confirmationEmail)

router.put("/resetpassword" , AuthUser([roles.user]),validation(resetPassword),authController.resetpassword)
router.patch("/forgetpassword" ,validation(sendingemailValidation), authController.sendingemail)
router.post('/reset-password-forgetted/:token',validation(userPasswordResetGen),authController.userPasswordResetGen)
export default  router