module.exports = (req, res, next) => {
    const { email, password } = req.body;
    const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    } if (!REGEX_EMAIL.test(email)) {
        return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    } if (!password) {
        return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    } if (password.length < 6) {
        return res.status(400).json({
            message: 'O "password" deve ter pelo menos 6 caracteres',
        });
    } return next();
};