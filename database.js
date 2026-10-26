const { createClient } = require('@libsql/client');

const db = createClient({
  url: 'libsql://faculdade-seuusuario.turso.io', // Cole sua URL aqui
  authToken: 'SEU_TOKEN_AQUI'                        // Cole seu Token aqui
});

async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      sexo TEXT NOT NULL,
      telefone TEXT NOT NULL,
      curso TEXT NOT NULL,
      instituicao TEXT NOT NULL,
      turno TEXT NOT NULL
    )
  `);
  console.log('Tabela "alunos" criada com sucesso no banco faculdade!');
}

initDb();

module.exports = db;