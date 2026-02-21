const { createClient } = require('@libsql/client');

let turso = null;

function getTurso() {
  if (!turso) {
    turso = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return turso;
}

module.exports = { getTurso };
