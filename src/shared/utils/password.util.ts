import * as argon2 from 'argon2';

async function hash(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

async function verify(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain);
}

export const passwordUtil = {
  hash,
  verify,
};
