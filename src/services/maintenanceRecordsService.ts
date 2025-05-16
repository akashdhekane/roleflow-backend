import { db } from "../db/init";

// Get all maintenance records
export const getAllMaintenanceRecords = async () => {
    const res = await db.query("SELECT * FROM maintenance_records ORDER BY date DESC");
    return res.rows;
};

// Get maintenance record by ID
export const getMaintenanceRecordById = async (id: string) => {
    const res = await db.query("SELECT * FROM maintenance_records WHERE id = $1", [id]);
    return res.rows[0];
};

// Create maintenance record
export const createMaintenanceRecord = async (data: any) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const params = fields.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO maintenance_records (${fields.join(", ")}) VALUES (${params}) RETURNING *`;
    const res = await db.query(query, values);
    return res.rows[0];
};

// Update maintenance record
export const updateMaintenanceRecord = async (id: string, data: any) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const query = `UPDATE maintenance_records SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
    values.push(id);
    const res = await db.query(query, values);
    return res.rows[0];
};

// Delete maintenance record
export const deleteMaintenanceRecord = async (id: string) => {
    await db.query("DELETE FROM maintenance_records WHERE id = $1", [id]);
};