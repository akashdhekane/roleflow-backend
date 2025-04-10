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
    try {
        const {
            firstName,
            lastName,
            email,
            role,
            department,
            managerId,
        } = data;

        // Validate department ID is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(department)) {
            throw new Error('Invalid department ID format');
        }

        const result = await db.query(
            `INSERT INTO users (first_name, last_name, email, role, department_id, manager_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [firstName, lastName, email, role, department, managerId]
        );

        return result.rows[0];
    } catch (error: any) {
        if (error.code === '22P02') { // PostgreSQL invalid input syntax error
            throw new Error('Invalid department ID format. Must be a valid UUID');
        }
        throw error;
    }
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
