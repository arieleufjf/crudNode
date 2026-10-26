const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  res.end(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Cadastro de Alunos - CRUD Node.js</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 30px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; }
        h2 { color: #2c3e50; text-align: center; }
        .campo { margin-bottom: 15px; }
        label { font-weight: bold; display: block; margin-bottom: 5px; }
        input[type="text"], input[type="tel"], select { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
        .radio-group { display: flex; gap: 15px; margin-top: 5px; }
        .radio-group label { font-weight: normal; cursor: pointer; }
        button { width: 100%; padding: 10px; background-color: #27ae60; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; }
        button:hover { background-color: #219150; }
      </style>
    </head>
    <body>
      <h2>Cadastro de Aluno</h2>
      
      <form onsubmit="alert('Cadastro realizado com sucesso!'); return false;">
        <div class="campo">
          <label for="nome">Nome Completo:</label>
          <input type="text" id="nome" placeholder="Ex: Maria Silva" required />
        </div>

        <div class="campo">
          <label for="sexo">Sexo:</label>
          <select id="sexo" required>
            <option value="">Selecione...</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro / Prefiro não informar</option>
          </select>
        </div>

        <div class="campo">
          <label for="telefone">Telefone:</label>
          <input type="tel" id="telefone" placeholder="(32) 99999-9999" required />
        </div>

        <div class="campo">
          <label for="curso">Curso:</label>
          <input type="text" id="curso" placeholder="Ex: Ciência da Computação" required />
        </div>

        <div class="campo">
          <label for="instituicao">Instituição de Ensino:</label>
          <input type="text" id="instituicao" placeholder="Ex: UFJF / Faculdade X" required />
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
    </body>
    </html>
  `);
});

server.listen(3000, () => {
  console.log('--------------------------------------------------');
  console.log('Servidor rodando em: http://localhost:3000');
  console.log('--------------------------------------------------');
});