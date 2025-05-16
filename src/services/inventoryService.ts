import { db } from "../db/init";

// Fetch all inventory items
export const getAllInventory = async () => {
    const res = await db.query("SELECT * FROM inventory ORDER BY created_at DESC");
    return res.rows;
};

// Fetch a specific inventory item by ID
export const getInventoryById = async (id: string) => {
    const res = await db.query("SELECT * FROM inventory WHERE id = $1", [id]);
    return res.rows[0];
};

// Create a new inventory item
export const createInventory = async (data: any) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const params = fields.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO inventory (${fields.join(", ")}) VALUES (${params}) RETURNING *`;
    const res = await db.query(query, values);
    return res.rows[0];
};

// Update an inventory item
export const updateInventory = async (id: string, data: any) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    if (fields.length === 0) return null;
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const query = `UPDATE inventory SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
    values.push(id);
    const res = await db.query(query, values);
    return res.rows[0];
};

// Delete an inventory item
export const deleteInventory = async (id: string) => {
    await db.query("DELETE FROM inventory WHERE id = $1", [id]);
};

// Update item quantity
export const updateInventoryQuantity = async (id: string, quantity: number) => {
    const res = await db.query(
        "UPDATE inventory SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
        [quantity, id]
    );
    return res.rows[0];
};
