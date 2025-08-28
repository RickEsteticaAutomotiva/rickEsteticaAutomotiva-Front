import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: './.env' });

const port = process.env.APP_PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});

app.get('/cadastrar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/cadastrar.html'));
});

app.get('/veiculo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/veiculo.html'));
});

app.listen(port, () => {
  console.log(`Frontend rodando em http://localhost:${port}`);
});
