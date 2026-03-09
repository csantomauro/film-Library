import pool from "./db.mjs";
import crypto from "crypto";

export default function UserDao() {

  this.getUserById = async (id) => {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE id=$1",
        [id]
      );

      if (result.rows.length === 0)
        return { error: "User not found" };

      return result.rows[0];

    } catch (err) {
      throw err;
    }
  };

  this.getUserByCredentials = async (email, password) => {

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return false;

    const row = result.rows[0];

    const user = {
      id: row.id,
      username: row.email,
      name: row.name
    };

    return new Promise((resolve, reject) => {

      crypto.scrypt(password, row.salt, 32, (err, hashedPassword) => {

        if (err) reject(err);

        if (!crypto.timingSafeEqual(
          Buffer.from(row.hash, "hex"),
          hashedPassword
        ))
          resolve(false);
        else
          resolve(user);

      });

    });

  };

}