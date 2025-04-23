import { db } from "../db/init";

export const createDepartment = async (data: { name: string }) => {
    const result = await db.query(
        "INSERT INTO departments (name, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *",
        [data.name]
    );
    return result.rows[0];
};

export const getAllDepartments = async () => {
    const result = await db.query("SELECT * FROM departments ORDER BY created_at DESC");
    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }));
};

export const getDepartmentById = async (id: string) => {
    const result = await db.query("SELECT * FROM departments WHERE id = $1", [id]);
    const row = result.rows[0];
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const updateDepartment = async (id: string, data: { name?: string }) => {
    const filteredEntries = Object.entries(data).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
    );

    const dbData = filteredEntries.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {} as Record<string, any>);

    const keys = Object.keys(dbData);
    if (keys.length === 0) {
        throw new Error("No valid fields to update.");
    }

    const fields = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = Object.values(dbData);
    values.push(id);

    const result = await db.query(
        `UPDATE departments SET ${fields}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
        values
    );
    return result.rows[0];
};

export const deleteDepartment = async (id: string) => {
    await db.query("DELETE FROM departments WHERE id = $1", [id]);
};
