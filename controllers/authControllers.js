import ctrlWrapper from '../decorators/ctrlWrapper.js';
import * as authServices from '../services/authServices.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const avatarDir = path.resolve('public', 'avatars');

export const registerController = ctrlWrapper(async (req, res, next) => {
  let avatarURL = null;
  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarDir, filename);
    await fs.rename(oldPath, newPath);
    avatarURL = path.join('posters', filename);
  }
  const newUser = await authServices.registerUser({ ...req.body, avatarURL });
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
});
export const verifyController = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  await authServices.verifyUser(verificationToken);

  res.json({
    message: 'Verification successful',
  });
});

export const resendVerifyEmailController = ctrlWrapper(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'missing required field email' });
  }

  await authServices.resendVerifyEmail(email);

  res.json({
    message: 'Verification email sent',
  });
});

export const loginController = ctrlWrapper(async (req, res) => {
  const { token, user } = await authServices.loginUser(req.body);
  res.json({
    token,
    user,
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

export const updateUserAvatarController = ctrlWrapper(async (req, res) => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }

  if (!req.file) {
    throw HttpError(400, 'File not found');
  }

  const { id, avatarURL: oldAvatarURL } = req.user;
  const { path: tempPath, filename } = req.file;
  const avatarsDir = path.resolve('public', 'avatars');
  const finalPath = path.join(avatarsDir, filename);

  if (oldAvatarURL) {
    const oldFileName = path.basename(oldAvatarURL);
    if (oldFileName !== filename) {
      const oldFilePath = path.join(avatarsDir, oldFileName);
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.log(`Failed to delete old avatar: ${error.message}`);
      }
    }
  }

  await fs.rename(tempPath, finalPath);

  const newAvatarURL = `/avatars/${filename}`;
  await authServices.updateUserAvatar(id, { avatarURL: newAvatarURL });

  res.status(200).json({ avatarURL: newAvatarURL });
});
