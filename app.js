const express = require('express');
const db = require('./database'); // Importa a conexão com o Turso

const app = express();
const PORT = process.env.PORT || 3000;

// Configura o Express para ler os dados enviados pelo formulário HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. ROTA GET: Exibe a página com o Formulário E a Tabela de Alunos cadastrados
app.get('/', async (req, res) => {
  try {
    // Busca todos os alunos no banco Turso
    const result = await db.execute('SELECT * FROM alunos ORDER BY id DESC');
    const alunos = result.rows;

    // Monta as linhas da tabela em HTML dinamicamente
    let linhasTabela = '';
    alunos.forEach(aluno => {
      linhasTabela += `
        <tr>
          <td>${aluno.id}</td>
          <td>${aluno.nome}</td>
          <td>${aluno.sexo}</td>
          <td>${aluno.telefone}</td>
          <td>${aluno.curso}</td>
          <td>${aluno.instituicao}</td>
          <td>${aluno.turno}</td>
        </tr>
      `;
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Cadastro de Alunos - CRUD UFJF</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 30px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; }
          h2, h3 { color: #2c3e50; text-align: center; }
          .campo { margin-bottom: 15px; }
          label { font-weight: bold; display: block; margin-bottom: 5px; }
          input[type="text"], input[type="tel"], select { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
          .radio-group { display: flex; gap: 15px; margin-top: 5px; }
          .radio-group label { font-weight: normal; cursor: pointer; }
          button { width: 100%; padding: 10px; background-color: #27ae60; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; }
          button:hover { background-color: #219150; }
          
          /* Estilos da Tabela */
          table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
          th { background-color: #2c3e50; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Cadastro de Aluno</h2>
        
        <!-- Form envia para a rota POST /cadastrar -->
        <form action="/cadastrar" method="POST">
          <div class="campo">
            <label for="nome">Nome Completo:</label>
            <input type="text" id="nome" name="nome" placeholder="Ex: Maria Silva" required />
          </div>

          <div class="campo">
            <label for="sexo">Sexo:</label>
            <select id="sexo" name="sexo" required>
              <option value="">Selecione...</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro / Prefiro não informar</option>
            </select>
          </div>

          <div class="campo">
            <label for="telefone">Telefone:</label>
            <input type="tel" id="telefone" name="telefone" placeholder="(32) 99999-9999" required />
          </div>

          <div class="campo">
            <label for="curso">Curso:</label>
            <input type="text" id="curso" name="curso" placeholder="Ex: Ciência da Computação" required />
          </div>

          <div class="campo">
            <label for="instituicao">Instituição de Ensino:</label>
            <input type="text" id="instituicao" name="instituicao" placeholder="Ex: UFJF" required />
          </div>

          <div class="campo">
            <label>Turno das Aulas:</label>
            <div class="radio-group">
              <label><input type="radio" name="turno" value="Manhã" required /> Manhã</label>
              <label><input type="radio" name="turno" value="Tarde" /> Tarde</label>
              <label><input type="radio" name="turno" value="Noite" /> Noite</label>
              <label><input type="radio" name="turno" value="Integral" /> Integral</label>
            </div>
          </div>

          <button type="submit">Cadastrar Aluno</button>
        </form>

        <hr style="margin-top: 30px;">

        <h3>Alunos Cadastrados</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Sexo</th>
              <th>Telefone</th>
              <th>Curso</th>
              <th>Instituição</th>
              <th>Turno</th>
            </tr>
          </thead>
          <tbody>
            ${linhasTabela.length > 0 ? linhasTabela : '<tr><td colspan="7" style="text-align:center;">Nenhum aluno cadastrado ainda.</td></tr>'}
          </tbody>
        </table>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Erro ao carregar os dados: ' + err.message);
  }
});

// 2. ROTA POST: Recebe os dados do formulário e insere no banco Turso
app.post('/cadastrar', async (req, res) => {
  const { nome, sexo, telefone, curso, instituicao, turno } = req.body;

  try {
    await db.execute({
      sql: 'INSERT INTO alunos (nome, sexo, telefone, curso, instituicao, turno) VALUES (?, ?, ?, ?, ?, ?)',
      args: [nome, sexo, telefone, curso, instituicao, turno]
    });

    // Redireciona de volta para a tela inicial atualizando a lista
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar aluno: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
