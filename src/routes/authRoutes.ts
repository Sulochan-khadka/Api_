import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
require('dotenv').config();

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_DAYS = 3;
const MAX_ACCOUNTS_PER_DAY = 5; // Maximum number of accounts allowed per day from the same IP
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

const router = Router();
const prisma = new PrismaClient();

// Generate a random 8 digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateAuthToken(tokenId: number): string {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: 'HS256',
    noTimestamp: true,
  });
}

// Get the IP address of the user making the request
function getClientIp(req: any): string {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
}

// Check if the given IP address has created more than the allowed number of accounts today
async function checkAccountLimit(ip: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
  const accountsCount = await prisma.user.count({
    where: {
      createdAt: {
        gte: today,
      },
      ip,
    },
  });
  return accountsCount >= MAX_ACCOUNTS_PER_DAY;
}

// Create a user, if it doesn't exist,
// generate the emailToken and send it to their email
router.post('/login', async (req, res) => {
  const { email } = req.body;
  const ip = getClientIp(req);

  // Check if the account limit has been reached for the current IP address
  const user = await prisma.user.findUnique({
    where: { email: email }, // Specify the condition using 'where'
  });

  if (!user) {
    const isAccountLimitExceeded = await checkAccountLimit(ip);

    if (isAccountLimitExceeded) {
      return res
        .status(403)
        .json({ error: 'Maximum account limit exceeded for today.' });
    }
  }

  // generate token
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: 'EMAIL',
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email, ip }, // Include the IP address when creating the user
          },
        },
      },
    });

    console.log(createdToken);
    const data = { emailToken };
    // TODO send emailToken to user's email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smpt.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      const mailOptions = {
        from: {
          name: 'author',
          address: process.env.SMTP_MAIL,
        },
        to: `${email}`,
        subject: 'OTP for the website',
        text: `${emailToken}`,
        html: `<b>${emailToken}</b>`,
      };
      const sendMail = async (transporter: any, mailOptions: any) => {
        try {
          await transporter.sendMail(mailOptions);
          // return res.status(200).json('mail sent');
          return console.log('mail sent');
        } catch (error) {
          // return res.status(200).json({ error: 'unable to send mail' });
          return console.log(error);
        }
      };
      sendMail(transporter, mailOptions);
    } catch (error: any) {
      return res.status(400).json({ error: 'unable to send email' });
    }
    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ error: "Couldn't start the authentication process" });
  }
});

// Validate the emailToken
// Generate a long-lived JWT token
router.post('/authenticate', async (req, res) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  });

  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.sendStatus(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res.status(401).json({ error: 'Token expired!' });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  // Here we validated that the user is the owner of the email

  // generate an API token
  const expiration = new Date(
    new Date().getTime() + AUTHENTICATION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
  );
  const apiToken = await prisma.token.create({
    data: {
      type: 'API',
      expiration,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  // Invalidate the email
  await prisma.token.update({
    where: { id: dbEmailToken.id },
    data: { valid: false },
  });

  // generate the JWT token
  const authToken = generateAuthToken(apiToken.id);

  return res.json({ authToken });
});

export default router;
