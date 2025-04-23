import { db } from "../db/init";

export const getAllInventoryItems = async () => {
    const result = await db.query("SELECT * FROM inventory ORDER BY last_updated DESC");
    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        quantity: row.quantity,
        minQuantity: row.min_quantity,
        category: row.category,
        status: row.status,
        location: row.location,
        assignedTo: row.assigned_to,
        vendor: row.vendor,
        cost: row.cost,
        imageUrl: row.image_url,
        sku: row.sku,
        departmentId: row.department_id,
        lastUpdated: row.last_updated,
    }));
};

export const getInventoryItemById = async (id: string) => {
    const result = await db.query("SELECT * FROM inventory WHERE id = $1", [id]);
    const row = result.rows[0];
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        quantity: row.quantity,
        minQuantity: row.min_quantity,
        category: row.category,
        status: row.status,
        location: row.location,
        assignedTo: row.assigned_to,
        vendor: row.vendor,
        cost: row.cost,
        imageUrl: row.image_url,
        sku: row.sku,
        departmentId: row.department_id,
        lastUpdated: row.last_updated,
    };
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
    const fieldMap: Record<string, string> = {
        minQuantity: "min_quantity",
        assignedTo: "assigned_to",
        imageUrl: "image_url",
        departmentId: "department_id",
    };

    const filteredEntries = Object.entries(data).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
    );

    const dbData = filteredEntries.reduce((acc, [key, value]) => {
        const dbKey = fieldMap[key] || key;
        acc[dbKey] = value;
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
        `UPDATE inventory SET ${fields}, last_updated = NOW() WHERE id = $${values.length} RETURNING *`,
        values
    );

    return result.rows[0];
};

export const deleteInventoryItem = async (id: string) => {
    await db.query("DELETE FROM inventory WHERE id = $1", [id]);
};
