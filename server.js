import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import sanitizeHtml from 'sanitize-html';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Fonction de nettoyage
const cleanInput = (input) =>
  sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  });

app.post('/api/contact', async (req, res) => {
  const rawName = req.body.name;
  const rawEmail = req.body.email;
  const rawMessage = req.body.message;

  // 🔐 Nettoyage des entrées
  const name = cleanInput(rawName);
  const email = cleanInput(rawEmail);
  const message = cleanInput(rawMessage);

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: 'contact@naelalaji.com',
      to: 'contact@naelalaji.com',
      replyTo: email,
      subject: `Message de ${name}`,
      text: message,
      // Optionnel : message au format HTML échappé
      html: `<pre style="font-family:sans-serif">${message}</pre>`
    });

    res.status(200).send('✅ Message envoyé');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Erreur : ' + err.message);
  }
});

app.listen(3001, () => {
  console.log('✅ Backend prêt sur http://localhost:3001');
});
