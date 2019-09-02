import crypto from 'crypto';

export function randomByte(size: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    crypto.randomBytes(size, (err, buff) => {
      if (err) {
        reject(err);
      } else {
        resolve(buff.toString('hex'));
      }
    });
  });
}
