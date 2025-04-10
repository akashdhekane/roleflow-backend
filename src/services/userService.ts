import { db } from "../db/init";


export const getAllUsers = async () => {
    const result = await db.query("SELECT * FROM users ORDER BY created_at DESC");
    return result.rows;
};

export const getUserById = async (id: string) => {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
};

export const createUser = async (data: any) => {
    const {
        firstName,
        lastName,
        email,
        role,
        department,
        managerId,
        photoUrl,
    } = data;

    const result = await db.query(
        `INSERT INTO users (first_name, last_name, email, role, department, manager_id, photo_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [firstName, lastName, email, role, department, managerId, photoUrl]
    );

    return result.rows[0];
};

export const updateUser = async (id: string, data: any) => {
    const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");

    const values = Object.values(data);
    values.push(id);

    const result = await db.query(
        `UPDATE users SET ${fields} WHERE id = $${values.length} RETURNING *`,
        values
    );

    return result.rows[0];
};

export const deleteUser = async (id: string) => {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
};
