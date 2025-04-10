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
    return result.rows;
};

export const getDepartmentById = async (id: string) => {
    const result = await db.query("SELECT * FROM departments WHERE id = $1", [id]);
    return result.rows[0];
};

export const updateDepartment = async (id: string, data: { name: string }) => {
    const result = await db.query(
        "UPDATE departments SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
        [data.name, id]
    );
    return result.rows[0];
};

export const deleteDepartment = async (id: string) => {
    await db.query("DELETE FROM departments WHERE id = $1", [id]);
};
