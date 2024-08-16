const express = require('express');
const path = require('path');

const routes = require('./routes');

const app = express();
// Middleware para processar JSON
app.use(express.json());

// Middleware para processar dados URL-encoded
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../src/public')));

// Configuração das rotas
app.use('/api', routes);

// Servir a página HTML de entrada
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
