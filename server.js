// server.js
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

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
  from: 'contact@naelalaji.com', // expéditeur AUTHENTIFIÉ (celui de Hostinger)
  to: 'contact@naelalaji.com',   // ou un autre destinataire
  replyTo: email,                // ← ici tu mets l'adresse du visiteur du site
  subject: `Message de ${name}`,
  text: message
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
