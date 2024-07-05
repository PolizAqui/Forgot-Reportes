const { editPassword } = require('../models/forgot');

const controller = {};

controller.editPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log({ email, password });
        const userPassword = await editPassword({ email, password });
        res.status(userPassword.code).json(userPassword);
    } catch (err) {
        res.status(500).json({ error: 'Error en el Servidor' });
    }
};

module.exports = controller;
