import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const algorithm = 'aes-256-cbc';
const password = process.env.ENCRYPTION_KEY || 'default-secret-key';
const salt = randomBytes(16);
const key = scryptSync(password, salt, 32);
const iv = randomBytes(16);

export function encrypt(text: string): string {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${salt.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, saltHex, encrypted] = encryptedText.split(':');
  const decipherIv = Buffer.from(ivHex, 'hex');
  const decipherSalt = Buffer.from(saltHex, 'hex');
  const decipherKey = scryptSync(password, decipherSalt, 32);

  const decipher = createDecipheriv(algorithm, decipherKey, decipherIv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
