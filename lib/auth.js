import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';

function getTurso() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return null;
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

// Session secret MUST be set via environment variable — no fallback
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret || sessionSecret.length < 32) {
  console.error('⚠️  SECURITY: SESSION_SECRET environment variable is missing or too short (min 32 chars). Admin auth will not work properly.');
}

export const sessionOptions = {
  password: sessionSecret || 'INSECURE_PLACEHOLDER_SET_SESSION_SECRET_ENV_VAR_NOW',
  cookieName: 'goholiday_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return await getIronSession(cookieStore, sessionOptions);
}

export async function login(email, password) {
  const turso = getTurso();
  if (!turso) {
    return { success: false, error: 'Database not configured' };
  }

  const result = await turso.execute({
    sql: 'SELECT * FROM admins WHERE email = ?',
    args: [email]
  });

  if (result.rows.length === 0) {
    return { success: false, error: 'Invalid credentials' };
  }

  const admin = result.rows[0];
  const isValid = await bcrypt.compare(password, admin.password_hash);

  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const session = await getSession();
  session.userId = admin.id;
  session.email = admin.email;
  await session.save();

  return { success: true };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session.userId;
}
