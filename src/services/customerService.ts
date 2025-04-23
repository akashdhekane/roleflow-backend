import { db } from "../db/init";

export const getAllCustomers = async () => {
    const result = await db.query("SELECT * FROM customers ORDER BY created_at DESC");
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
        company: row.company,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }));
};

export const getCustomerById = async (id: string) => {
    const result = await db.query("SELECT * FROM customers WHERE id = $1", [id]);
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
        company: row.company,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const createCustomer = async (data: any) => {
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
        company, // <-- Added company
    } = data;

    // Convert empty strings to null for UUID fields
    const sanitizedManagerId = managerId?.trim() || null;
    const sanitizedDepartmentId = departmentId?.trim() || null;

    const result = await db.query(
        `INSERT INTO customers (
            name, contact_name, email, phone, address, status, website, 
            description, type, manager_id, department_id, service_categories, 
            category, notes, company, created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW()
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
            sanitizedManagerId,  // Use sanitized value
            sanitizedDepartmentId,  // Use sanitized value
            serviceCategories,
            category,
            notes,
            company, // <-- Added company
        ]
    );
    return result.rows[0];
};

export const updateCustomer = async (id: string, data: any) => {
    const fieldMap: Record<string, string> = {
        contactName: "contact_name",
        managerId: "manager_id",
        departmentId: "department_id",
        serviceCategories: "service_categories",
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
        `UPDATE customers SET ${fields} WHERE id = $${values.length} RETURNING *`,
        values
    );

    return result.rows[0];
};

export const deleteCustomer = async (id: string) => {
    await db.query("DELETE FROM customers WHERE id = $1", [id]);
};
