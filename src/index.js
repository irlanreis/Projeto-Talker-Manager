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

app.get('/talker/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const talkers = await readTalker();
  const talkerSearch = talkers.filter((talk) => talk.name.toLowerCase().includes(q.toLowerCase()));
  
  return res.status(200).json(talkerSearch);
});

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
    const newTalker = {
      id: talkers.length + 1,
      ...talkerObjt,
    };

    talkers.push(newTalker);
    await writeTalker(talkers);
    return res.status(201).json(newTalker);
  });

app.put('/talker/:id',
  validateToken,
  validateTalk,
  validateWatcheAt,
  validateRate,
  validateAge,
  validateName, async (req, res) => {
    const { id } = req.params;
    const talkerObjt = req.body;
    const talkers = await readTalker();
    const talkerId = talkers.find((talk) => talk.id === +id);
    const talkerIndex = talkers.findIndex((talk) => talk.id === +id);

    if (!talkerId) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }
    const newTalker = { id: +id, ...talkerObjt };
    talkers[talkerIndex] = newTalker;
    await writeTalker(talkers);
    return res.status(200).json(newTalker);
  });

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await readTalker();
  const talkerId = talkers.find((talk) => talk.id === +id);
  const deletedTalker = talkers.filter((talk) => talk.id !== +id);

  if (!talkerId) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  await writeTalker(deletedTalker);
  return res.status(204).json();
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
