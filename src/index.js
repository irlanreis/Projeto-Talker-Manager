const express = require('express');
const { readTalker, generateToken } = require('./utils/read');

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

app.post('/login', async (req, res) => {
  const tokenRandom = await generateToken();

  return res.status(200).json({ token: tokenRandom });
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
