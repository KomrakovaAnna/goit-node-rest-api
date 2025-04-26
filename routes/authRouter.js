import express from 'express';
import validateBody from '../decorators/validateBody.js';
import {
  authLoginSchema,
  authRegisterSchema,
  authVerifySchema,
} from '../schemas/authSchema.js';
import {
  registerController,
  loginController,
  getCurrentController,
  logoutController,
  updateUserAvatarController,
  verifyController,
  resendVerifyEmailController,
} from '../controllers/authControllers.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
const authRouter = express.Router();

authRouter.post(
  '/register',
  upload.single('avatarURL'),
  validateBody(authRegisterSchema),
  registerController
);

authRouter.get('/verify/:verificationCode', verifyController);

authRouter.post(
  '/verify',
  validateBody(authVerifySchema),
  resendVerifyEmailController
);
authRouter.post('/login', validateBody(authLoginSchema), loginController);

authRouter.get('/current', authenticate, getCurrentController);

authRouter.post('/logout', authenticate, logoutController);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatarURL'),
  updateUserAvatarController
);

export default authRouter;
