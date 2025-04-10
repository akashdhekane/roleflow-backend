import { db } from "../db/init";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const loginUser = async (email: string, password: string) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    delete user.password;
    return { user, token };
};

export const registerUser = async (data: any) => {
    const {
        firstName,
        lastName,
        email,
        password,
    } = data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
        `INSERT INTO users (
          first_name, last_name, email, password_hash, created_at
        ) VALUES (
          $1, $2, $3, $4, NOW()
        ) RETURNING id, first_name, last_name, email, created_at`,
        [firstName, lastName, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return { user, token };
};
