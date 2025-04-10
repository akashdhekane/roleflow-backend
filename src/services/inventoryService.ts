import { db } from "../db/init";

export const getAllInventoryItems = async () => {
    const result = await db.query("SELECT * FROM inventory ORDER BY last_updated DESC");
    return result.rows;
};

export const getInventoryItemById = async (id: string) => {
    const result = await db.query("SELECT * FROM inventory WHERE id = $1", [id]);
    return result.rows[0];
};

export const createInventoryItem = async (data: any) => {
    const {
        name,
        description,
        quantity,
        minQuantity,
        category,
        status,
        location,
        assignedTo,
        vendor,
        cost,
        imageUrl,
        sku,
        departmentId,
    } = data;

    const result = await db.query(
        `INSERT INTO inventory (
      name, description, quantity, min_quantity, category, status, location,
      assigned_to, vendor, cost, image_url, sku, department_id, last_updated
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13, NOW()
    ) RETURNING *`,
        [
            name,
            description,
            quantity,
            minQuantity,
            category,
            status,
            location,
            assignedTo,
            vendor,
            cost,
            imageUrl,
            sku,
            departmentId,
        ]
    );

    return result.rows[0];
};

export const updateInventoryItem = async (id: string, data: any) => {
    const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");
    const values = Object.values(data);
    values.push(id);

    const result = await db.query(
        `UPDATE inventory SET ${fields}, last_updated = NOW() WHERE id = $${values.length} RETURNING *`,
        values
    );

    return result.rows[0];
};

export const deleteInventoryItem = async (id: string) => {
    await db.query("DELETE FROM inventory WHERE id = $1", [id]);
};
