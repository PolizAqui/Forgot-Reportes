const pool = require('../utils/mysql.connect.js');
const bcrypt = require('bcrypt');

//--------------Verify Email --------------//

const verifyEmail = async ({ email }) => {
    try {
        const connection = await pool.getConnection();

        // Consulta para verificar si el correo electrónico existe en la tabla `aliados`
        const sqlEmailAliados = 'SELECT * FROM aliados WHERE email = ?';
        const [rowsAliados] = await connection.execute(sqlEmailAliados, [email]);

        // Consulta para verificar si el correo electrónico existe en la tabla `usuarios`
        const sqlEmailUsuarios = 'SELECT * FROM usuarios WHERE email = ?';
        const [rowsUsuarios] = await connection.execute(sqlEmailUsuarios, [email]);

        connection.release();

        if (rowsAliados.length === 0 && rowsUsuarios.length === 0) {
            return {
                status: false,
                message: 'Email not found',
                code: 404,
            };
        } else {
            return {
                status: true,
                message: 'Email found',
                code: 200,
            };
        }
    } catch (err) {
        console.error('Error en verifyEmail:', err);
        return {
            status: false,
            message: 'Server error',
            code: 500,
            error: err,
        };
    }
};

//--------------Update Password --------------//

const editPassword = async ({ email, password }) => {
    try {
        const connection = await pool.getConnection();

        // Verifica si el email existe en la tabla `aliados`
        const [verifyAliados] = await connection.execute('SELECT email FROM aliados WHERE email = ?', [email]);

        // Verifica si el email existe en la tabla `usuarios`
        const [verifyUsuarios] = await connection.execute('SELECT email FROM usuarios WHERE email = ?', [email]);

        if (verifyAliados.length > 0) {
            const hash = await bcrypt.hash(password, 10);
            const [result] = await connection.execute('UPDATE aliados SET password = ? WHERE email = ?', [hash, email]);

            connection.release();

            if (result.affectedRows > 0) {
                return {
                    status: true,
                    message: 'Password Updated',
                    code: 200,
                };
            } else {
                return {
                    status: false,
                    message: 'Password not updated',
                    code: 500,
                };
            }
        } else if (verifyUsuarios.length > 0) {
            const hash = await bcrypt.hash(password, 10);
            const [result] = await connection.execute('UPDATE usuarios SET password = ? WHERE email = ?', [hash, email]);

            connection.release();

            if (result.affectedRows > 0) {
                return {
                    status: true,
                    message: 'Password Updated',
                    code: 200,
                };
            } else {
                return {
                    status: false,
                    message: 'Password not updated',
                    code: 500,
                };
            }
        } else {
            connection.release();
            return {
                status: false,
                message: 'Email not found',
                code: 404,
            };
        }
    } catch (err) {
        console.error('Error en editPassword:', err);
        return {
            status: false,
            message: 'Server error',
            code: 500,
            error: err,
        };
    }
};

module.exports = {
    verifyEmail,
    editPassword
};
