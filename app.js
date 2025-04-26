import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import chalk from 'chalk';
import 'dotenv/config';
import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/authRouter.js';
import nodemailer from 'nodemailer';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465, // 25, 2525
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  from: `Anna Komrakova ${UKR_NET_EMAIL}`,
  to: 'komrakova.anna@gmail.com',
  subject: 'Hello',
  html: '<h1>Hello!</h1>',
};

transport
  .sendMail(email)
  .then(msg => console.log(msg))
  .catch(error => console.log(error));

app.use((err, req, res, next) => {
  console.log(chalk.redBright('Error middleware:', err));
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

const { PORT = 3000 } = process.env;
const port = Number(PORT);

app.listen(port, () => {
  console.log(
    chalk.greenBright(`Server is running. Use our API on port: ${port}`)
  );
});
