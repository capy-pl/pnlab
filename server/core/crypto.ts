import crypto from 'crypto';

const config = {
  digest: 'sha512',
  hashBytes: 128,
  iterations: 6000,
  saltLength: 20,
};

interface HashResult {
  hashedPassword: string;
  salt: string;
}

function generateSalt(size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(Math.floor(size / 2), (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex').slice(0, size));
      }
    });
  });
}

async function hashPassword(salt: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, config.iterations, config.hashBytes, config.digest, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.toString('hex'));
      }
    });
  });
}

export async function encryptPassword(password: string): Promise<HashResult> {
  const salt = await generateSalt(config.saltLength);
  const hashedPassword = await hashPassword(salt, password);
  return {
    hashedPassword,
    salt,
  };
}

export async function validatePassword(password: string, salt: string, hashedPassword: string): Promise<boolean> {
  const result = await hashPassword(salt, password);
  return result === hashedPassword;
}
