const { createClient } = require('@libsql/client');

// Lê as chaves das variáveis de ambiente
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function initDb() {
  try {
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
    console.log('Tabela "alunos" verificada/criada no Turso!');
  } catch (err) {
    console.error('Erro ao inicializar banco no Turso:', err.message);
  }
}

initDb();

module.exports = db;
