const express = require('express');
const db = require('./database'); // Importa a conexão com o banco Turso

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de middlewares para processar dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// -----------------------------------------------------------------------------
// HELPER: Estilos CSS unificados para todas as telas
// -----------------------------------------------------------------------------
const cssEstilos = `
  <style>
    * { box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background-color: #f4f6f9; margin: 0; padding: 30px 15px; color: #333; }
    .container { max-width: 900px; margin: 0 auto; background: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
    h2, h3 { color: #1e293b; margin-top: 0; text-align: center; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .campo { margin-bottom: 12px; }
    .campo-full { grid-column: span 2; }
    label { font-weight: 600; display: block; margin-bottom: 6px; font-size: 14px; color: #475569; }
    input[type="text"], input[type="tel"], select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }
    input:focus, select:focus { border-color: #3b82f6; outline: none; }
    .radio-group { display: flex; gap: 15px; margin-top: 6px; }
    .radio-group label { font-weight: normal; cursor: pointer; }
    .btn { padding: 10px 18px; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer; text-decoration: none; display: inline-block; text-align: center; }
    .btn-primary { background-color: #2563eb; color: white; width: 100%; }
    .btn-primary:hover { background-color: #1d4ed8; }
    .btn-warning { background-color: #f59e0b; color: white; padding: 6px 12px; font-size: 13px; }
    .btn-danger { background-color: #ef4444; color: white; padding: 6px 12px; font-size: 13px; }
    .btn-secondary { background-color: #64748b; color: white; margin-top: 10px; }
    
    /* Tabela de Alunos */
    table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 14px; }
    th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
    th { background-color: #0f172a; color: white; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .acoes { display: flex; gap: 6px; justify-content: center; }
  </style>
`;

// -----------------------------------------------------------------------------
// 1. ROTA GET '/': Lista os alunos e exibe o formulário de cadastro
// -----------------------------------------------------------------------------
app.get('/', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM alunos ORDER BY id DESC');
    const alunos = result.rows;

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
          <td class="acoes">
            <a href="/editar/${aluno.id}" class="btn btn-warning">Editar</a>
            <form action="/deletar/${aluno.id}" method="POST" style="display:inline;" onsubmit="return confirm('Tem certeza que deseja excluir este aluno?');">
              <button type="submit" class="btn btn-danger">Excluir</button>
            </form>
          </td>
        </tr>
      `;
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>CRUD de Alunos - UFJF</title>
        ${cssEstilos}
      </head>
      <body>
        <div class="container">
          <h2>Cadastro de Alunos</h2>
          
          <form action="/cadastrar" method="POST">
            <div class="form-grid">
              <div class="campo campo-full">
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
                <label for="instituicao">Instituição:</label>
                <input type="text" id="instituicao" name="instituicao" placeholder="Ex: UFJF" required />
              </div>

              <div class="campo campo-full">
                <label>Turno das Aulas:</label>
                <div class="radio-group">
                  <label><input type="radio" name="turno" value="Manhã" required /> Manhã</label>
                  <label><input type="radio" name="turno" value="Tarde" /> Tarde</label>
                  <label><input type="radio" name="turno" value="Noite" /> Noite</label>
                  <label><input type="radio" name="turno" value="Integral" /> Integral</label>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 10px;">Cadastrar Aluno</button>
          </form>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">

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
                <th style="text-align: center;">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${linhasTabela.length > 0 ? linhasTabela : '<tr><td colspan="8" style="text-align:center;">Nenhum aluno cadastrado no momento.</td></tr>'}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Erro ao carregar dados do banco: ' + err.message);
  }
});

// -----------------------------------------------------------------------------
// 2. ROTA POST '/cadastrar': Insere um novo aluno no Turso
// -----------------------------------------------------------------------------
app.post('/cadastrar', async (req, res) => {
  const { nome, sexo, telefone, curso, instituicao, turno } = req.body;

  try {
    await db.execute({
      sql: 'INSERT INTO alunos (nome, sexo, telefone, curso, instituicao, turno) VALUES (?, ?, ?, ?, ?, ?)',
      args: [nome, sexo, telefone, curso, instituicao, turno]
    });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar aluno: ' + err.message);
  }
});

// -----------------------------------------------------------------------------
// 3. ROTA GET '/editar/:id': Abre o formulário preenchido com dados do aluno
// -----------------------------------------------------------------------------
app.get('/editar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM alunos WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).send('Aluno não encontrado!');
    }

    const aluno = result.rows[0];

    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Editar Aluno</title>
        ${cssEstilos}
      </head>
      <body>
        <div class="container" style="max-width: 600px;">
          <h2>Editar Registro do Aluno #${aluno.id}</h2>

          <form action="/atualizar/${aluno.id}" method="POST">
            <div class="campo">
              <label for="nome">Nome Completo:</label>
              <input type="text" id="nome" name="nome" value="${aluno.nome}" required />
            </div>

            <div class="campo">
              <label for="sexo">Sexo:</label>
              <select id="sexo" name="sexo" required>
                <option value="Feminino" ${aluno.sexo === 'Feminino' ? 'selected' : ''}>Feminino</option>
                <option value="Masculino" ${aluno.sexo === 'Masculino' ? 'selected' : ''}>Masculino</option>
                <option value="Outro" ${aluno.sexo === 'Outro' ? 'selected' : ''}>Outro / Prefiro não informar</option>
              </select>
            </div>

            <div class="campo">
              <label for="telefone">Telefone:</label>
              <input type="tel" id="telefone" name="telefone" value="${aluno.telefone}" required />
            </div>

            <div class="campo">
              <label for="curso">Curso:</label>
              <input type="text" id="curso" name="curso" value="${aluno.curso}" required />
            </div>

            <div class="campo">
              <label for="instituicao">Instituição de Ensino:</label>
              <input type="text" id="instituicao" name="instituicao" value="${aluno.instituicao}" required />
            </div>

            <div class="campo">
              <label>Turno das Aulas:</label>
              <div class="radio-group">
                <label><input type="radio" name="turno" value="Manhã" ${aluno.turno === 'Manhã' ? 'checked' : ''} /> Manhã</label>
                <label><input type="radio" name="turno" value="Tarde" ${aluno.turno === 'Tarde' ? 'checked' : ''} /> Tarde</label>
                <label><input type="radio" name="turno" value="Noite" ${aluno.turno === 'Noite' ? 'checked' : ''} /> Noite</label>
                <label><input type="radio" name="turno" value="Integral" ${aluno.turno === 'Integral' ? 'checked' : ''} /> Integral</label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 15px;">Salvar Alterações</button>
            <a href="/" class="btn btn-secondary" style="display
