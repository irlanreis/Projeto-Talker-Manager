const fs = require('fs').promises;
const path = require('path');

const talker = path.resolve('src', 'talker.json');

async function readTalker() {
    try {
        const jsonTalker = await fs.readFile(talker, 'utf-8');
        return JSON.parse(jsonTalker);
    } catch (error) {
        console.error(error.message);
    }
}

async function writeTalker(talkers) {
    try {
        const stringTalkers = JSON.stringify(talkers, null, 2);
        const writedTalkers = await fs.writeFile(talker, stringTalkers);

        return writedTalkers;
    } catch (error) {
        console.error(error.message);
    }
}

async function generateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const tokenLength = 16;
    const randomChars = Array.from({ length: tokenLength }, () => characters[
        Math.floor(Math.random() * characters.length)]);
    const token = randomChars.join('');
    return token;
}

module.exports = {
    generateToken,
    writeTalker,
    readTalker,
};