const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Requisição para a API do SUAP para autenticação
    const response = await axios.post('https://suap.ifrn.edu.br/api/v2/autenticacao/token/', {
      username, // Matrícula
      password
    });

    // Verifica se a autenticação foi bem-sucedida
    if (response.status === 200) { //HTTP 200
      const { token } = response.data;

      // Requisição para obter os dados do usuário logado
      const userResponse = await axios.get('https://suap.ifrn.edu.br/api/v2/minhas-informacoes/meus-dados/', {
        headers: {
          'Authorization': `JWT ${token}`
        }
      });

      // Renderiza a página de sucesso com os dados do usuário
      res.render('success', { user: userResponse.data });
    } else {
      res.render('login', { error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Ocorreu um erro ao fazer login' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
