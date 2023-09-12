import bcrypt = require("bcryptjs");

export async function encrypt(plain: string): Promise<string> {
  console.log(plain);
  return await bcrypt.hash(plain, 10);
}

export async function checkPassword(
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashPassword);
}
