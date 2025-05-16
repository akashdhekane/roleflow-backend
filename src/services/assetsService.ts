import { db } from "../db/init";

// Get all assets
export const getAllAssets = async () => {
    const res = await db.query("SELECT * FROM assets ORDER BY created_at DESC");
    return res.rows;
};

// Get asset by ID
export const getAssetById = async (id: string) => {
    const res = await db.query("SELECT * FROM assets WHERE id = $1", [id]);
    return res.rows[0];
};

// Create asset
export const createAsset = async (data: any) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const params = fields.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO assets (${fields.join(", ")}) VALUES (${params}) RETURNING *`;
    const res = await db.query(query, values);
    return res.rows[0];
};

// Update asset
export const updateAsset = async (id: string, data: any) => {
    const fields = Object.keys(data);
    if (fields.length === 0) return null; // No fields to update

    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    // Add updated_at as the last field
    const query = `UPDATE assets SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
    values.push(id);

    const res = await db.query(query, values);
    return res.rows[0];
};

// Delete asset
export const deleteAsset = async (id: string) => {
    await db.query("DELETE FROM assets WHERE id = $1", [id]);
};

// Get maintenance records for an asset
export const getAssetMaintenanceRecords = async (assetId: string) => {
    const res = await db.query(
        "SELECT * FROM maintenance_records WHERE asset_id = $1 ORDER BY date DESC",
        [assetId]
    );
    return res.rows;
};