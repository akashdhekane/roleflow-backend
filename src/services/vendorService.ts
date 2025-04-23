import { db } from "../db/init";

export const getAllVendors = async () => {
    const result = await db.query("SELECT * FROM vendors ORDER BY created_at DESC");
    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        contactName: row.contact_name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        status: row.status,
        website: row.website,
        description: row.description,
        type: row.type,
        managerId: row.manager_id,
        departmentId: row.department_id,
        serviceCategories: row.service_categories,
        category: row.category,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }));
};

export const getVendorById = async (id: string) => {
    const result = await db.query("SELECT * FROM vendors WHERE id = $1", [id]);
    const row = result.rows[0];
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        contactName: row.contact_name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        status: row.status,
        website: row.website,
        description: row.description,
        type: row.type,
        managerId: row.manager_id,
        departmentId: row.department_id,
        serviceCategories: row.service_categories,
        category: row.category,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
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
        createdAt, // <-- Accept createdAt from request if provided
    } = data;

    // Use provided createdAt if available, otherwise default to NOW()
    const result = await db.query(
        `INSERT INTO vendors (
            name, contact_name, email, phone, address, status, website, description, type,
            manager_id, department_id, service_categories, category, notes, created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, ${createdAt ? '$15' : 'NOW()'}, NOW()
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
            ...(createdAt ? [createdAt] : []),
        ]
    );

    return result.rows[0];
};

export const updateVendor = async (id: string, data: any) => {
    // Map frontend keys to DB columns
    const fieldMap: Record<string, string> = {
        contactName: "contact_name",
        managerId: "manager_id",
        departmentId: "department_id",
        serviceCategories: "service_categories",
        createdAt: "created_at", // <-- Add mapping for createdAt
    };

    // Filter out null or empty values
    const filteredEntries = Object.entries(data).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
    );

    // Build a new object with DB column keys
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
