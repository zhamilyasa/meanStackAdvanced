// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' }
]; 
const SECRET = 'секретный_ключ';

app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ msg: 'Пользователь существует' });
  }
  users.push({ username, password, role });
  res.json({ msg: 'Регистрация успешна' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ msg: 'Неверные данные' });

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});


app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: 'Нет токена' });

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, SECRET);
    res.json({ msg: 'Доступ разрешён' });
  } catch {
    res.status(403).json({ msg: 'Неверный токен' });
  }
});

app.listen(3000, () => console.log('🚀 Server запущен на http://localhost:3000'));
