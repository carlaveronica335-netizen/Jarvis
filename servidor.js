const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORTA = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const ARQUIVO_DADOS = path.join(__dirname, 'conhecimento.json');
const SENHA = "Wubba Lubba Dub Dub";

function carregarConhecimento() {
  if (fs.existsSync(ARQUIVO_DADOS)) {
    return JSON.parse(fs.readFileSync(ARQUIVO_DADOS, 'utf8'));
  }
  return {};
}

function salvarConhecimento(dados) {
  fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(dados, null, 2), 'utf8');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/conhecimento', (req, res) => {
  res.json(carregarConhecimento());
});

app.post('/api/ensinar', (req, res) => {
  const { pergunta, resposta, senha } = req.body;
  if (senha !== SENHA) return res.status(403).json({erro: 'Sem permissão'});
  if (!pergunta || !resposta) return res.status(400).json({erro: 'Faltam dados'});
  const dados = carregarConhecimento();
  dados[pergunta] = resposta;
  salvarConhecimento(dados);
  res.json({ok: true});
});

app.post('/api/apagar-tudo', (req, res) => {
  const { senha } = req.body;
  if (senha !== SENHA) return res.status(403).json({erro: 'Sem permissão'});
  salvarConhecimento({});
  res.json({ok: true});
});

app.get('/api/horario', (req, res) => {
  const agora = new Date();
  const horario = agora.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    day: '2-digit', month: 'long', year: 'numeric'
  });
  res.json({horario: `Agora são: ${horario} ⏰`});
});

app.listen(PORTA, () => {
  console.log(`JARVIS rodando na porta ${PORTA}`);
});
        

