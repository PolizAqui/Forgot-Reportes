const nodemailer = require('nodemailer');
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = require('../global/_var.js');
const { google } = require('googleapis');
const { verifyEmail } = require('../models/forgot.js');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(toEmail, resetLink) {
    try{
        const accessTokenInfo = await oauth2Client.getAccessToken();
        const accessToken = accessTokenInfo.token;

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'polizaqui.contact@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOption = {
            from: 'PolizaSupport <polizaqui.contact@gmail.com>',
            to: toEmail,
            subject: 'Recuperación de Contraseña',
            html: `
               <img src="cid:logo" width="250" height="100">
                <p>Hola ${toEmail},</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, por favor ignora este correo.</p>
                <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                <p><a href="${resetLink}">[Enlace para restablecer contraseña]</a></p>
                <p>Este enlace es válido por 24 horas. Si el enlace ha expirado, por favor solicita nuevamente la recuperación de contraseña desde nuestro sitio web.</p>
                <p>Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos.</p>
                <p>Gracias,</p>
                <p>polizaqui.contact@gmail.com</p>
                <p>Telefono: (+58) 4147232513</p>
            `,
            attachments: [
                {
                    filename: 'logotipo.jpeg',
                    path: path.join(__dirname, '../assets/logotipo.jpeg'),
                    cid: 'logo'
                }
            ]
        };

        const result = await transport.sendMail(mailOption);
        return result;

    }catch (err) {
        return err;
    }
}



const controller = {};


controller.Recuperacion = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body);
        const user = await verifyEmail({ email });
        console.log(user);
        if (!user.status) {
            res.status(user.code).json({ error: user.message });
        } else {
            const resetLink = `http://localhost:8100/confirm-forgot/${email}`;
            const mailResult = await sendMail(email, resetLink);
            if (mailResult instanceof Error) {
                res.status(500).json({ error: 'Error al enviar el correo electrónico' });
            } else {
                res.status(user.code).json(user);
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el Servidor' });
    }
};

module.exports = controller;