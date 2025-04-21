import express from 'express';
import validateBody from '../decorators/validateBody.js';
import { authLoginSchema, authRegisterSchema } from '../schemas/authSchema.js';
import {
  registerController,
  loginController,
  getCurrentController,
  logoutController,
} from '../controllers/authControllers.js';
import { authenticate } from '../middlewares/authenticate.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  registerController
);
authRouter.post('/login', validateBody(authLoginSchema), loginController);

authRouter.get('/current', authenticate, getCurrentController);

authRouter.post('/logout', authenticate, logoutController);

export default authRouter;
