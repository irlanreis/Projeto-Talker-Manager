const express = require('express');
const { readTalker, generateToken } = require('./utils/read');
const validateLogin = require('./middlewares/validateLogin');
const { writeTalker } = require('./utils/read');
const validateName = require('./middlewares/validateName');
const validateToken = require('./middlewares/validateToken');
const validateAge = require('./middlewares/validateAge');
const validateTalk = require('./middlewares/validateTalk');
const validateWatcheAt = require('./middlewares/validateWatchedAt');
const validateRate = require('./middlewares/validadeRate');

const app = express();

app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.get('/talker', async (_req, res) => {
  const talkers = await readTalker();
  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await readTalker();
  const idTalker = req.params.id;
  const [talkerFiltered] = talkers.filter((talker) => talker.id === Number(idTalker));

  if (!talkerFiltered) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(talkerFiltered);
});

app.post('/login', validateLogin, async (req, res) => {
  const tokenRandom = await generateToken();

  return res.status(200).json({ token: tokenRandom });
});

app.post('/talker',
  validateToken,
  validateTalk,
  validateWatcheAt,
  validateRate,
  validateAge,
  validateName, async (req, res) => {
    const talkerObjt = req.body;
    const talkers = await readTalker();
    console.log(talkerObjt);
    const newTalker = {
      id: talkers.length + 1,
      ...talkerObjt,
    };
    console.log(newTalker);

    talkers.push(newTalker);
    await writeTalker(talkers);
    return res.status(201).json(newTalker);
  });

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
