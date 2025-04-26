import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../helpers/jwt.js';
import gravatar from 'gravatar';
import { nanoid } from 'nanoid';
import sendEmail from '../helpers/sendEmail.js';

const { APP_DOMAIN } = process.env;

const createVerifyEmail = (email, verificationCode) => ({
  to: email,
  subject: 'Verify email',
  html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationCode}" target="_blank">Click verify email</a>`,
});

export const findUser = query =>
  User.findOne({
    where: query,
  });

export const registerUser = async data => {
  const { email, password } = data;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    throw HttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();
  const avatarURL = gravatar.url(email, { s: '250', d: 'mp' }, true);

  const newUser = await User.create({
    ...data,
    password: hashedPassword,
    avatarURL,
    verificationCode,
  });
  const verifyEmail = createVerifyEmail(email, verificationCode);

  await sendEmail(verifyEmail);

  return newUser;
};

export const verifyUser = async verificationCode => {
  const user = await findUser({ verificationCode });
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await user.update({ verificationCode: null, verify: true });
};

export const resendVerifyEmail = async email => {
  const user = await findUser({ email });
  if (!user) {
    throw HttpError(404, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = createVerifyEmail(email, user.verificationCode);

  await sendEmail(verifyEmail);
};

export const loginUser = async data => {
  const { email, password } = data;
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { email };

  const token = generateToken(payload);

  await user.update({ token });

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

export const logoutUser = async id => {
  const user = await findUser({ id });
  if (!user || !user.token) {
    throw HttpError(401, 'Not authorized');
  }

  await user.update({ token: null });
};

export const updateUserAvatar = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await user.update(data);
  return user;
};
