import { db } from "../db/init";

export const getAllVendors = async () => {
    const result = await db.query("SELECT * FROM vendors ORDER BY created_at DESC");
    return result.rows;
};

export const getVendorById = async (id: string) => {
    const result = await db.query("SELECT * FROM vendors WHERE id = $1", [id]);
    return result.rows[0];
};

export const createVendor = async (data: any) => {
    const {
        name,
        contactName,
        email,
        phone,
        address,
        status,
        website,
        description,
        type,
        managerId,
        departmentId,
        serviceCategories,
        category,
        notes,
    } = data;

    const result = await db.query(
        `INSERT INTO vendors (
      name, contact_name, email, phone, address, status, website, description, type,
      manager_id, department_id, service_categories, category, notes, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, NOW(), NOW()
    ) RETURNING *`,
        [
            name,
            contactName,
            email,
            phone,
            address,
            status,
            website,
            description,
            type,
            managerId,
            departmentId,
            serviceCategories,
            category,
            notes,
        ]
    );

    return result.rows[0];
};

export const updateVendor = async (id: string, data: any) => {
    const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");
    const values = Object.values(data);
    values.push(id);

    const result = await db.query(
        `UPDATE vendors SET ${fields}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
        values
    );

    return result.rows[0];
};

export const deleteVendor = async (id: string) => {
    try {
        await db.query("DELETE FROM vendors WHERE id = $1", [id]);
        return { status: 200, message: 'Vendor deleted successfully.' };
    } catch (error: any) {
        throw new Error(`Error deleting vendor: ${error.message}`);
    }
};
