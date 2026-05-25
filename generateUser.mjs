import crypto from "crypto";

const password = "password";
const salt = crypto.randomBytes(16).toString("hex");

crypto.scrypt(password, salt, 32, (err, derivedKey) => {
  const hash = derivedKey.toString("hex");

  console.log(`
INSERT INTO users (email, name, hash, salt)
VALUES ('user@filmLibrary.com','Mario Rossi','${hash}','${salt}');
`);
});