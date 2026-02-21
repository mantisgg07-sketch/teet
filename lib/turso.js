import { createClient } from '@libsql/client';

let tursoInstance = null;

export function getTurso() {
  if (!tursoInstance) {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      // Return a mock client during build
      return {
        execute: async () => ({ rows: [] }),
      };
    }
    
    tursoInstance = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  
  return tursoInstance;
}
