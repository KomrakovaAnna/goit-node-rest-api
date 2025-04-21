import ctrlWrapper from '../decorators/ctrlWrapper.js';
import * as authServices from '../services/authServices.js';

export const registerController = ctrlWrapper(async (req, res, next) => {
  const newUser = await authServices.registerUser(req.body);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
});

export const loginController = ctrlWrapper(async (req, res) => {
  const { token } = await authServices.loginUser(req.body);
  res.json({
    token,
  });
});

export const getCurrentController = ctrlWrapper(async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
});

export const logoutController = ctrlWrapper(async (req, res) => {
  const { id } = req.user;
  await authServices.logoutUser(id);

  res.sendStatus(204);
});
