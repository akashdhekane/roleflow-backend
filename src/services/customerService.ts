import { db } from "../db/init";

export const getAllCustomers = async () => {
    const result = await db.query("SELECT * FROM customers ORDER BY created_at DESC");
    return result.rows;
};

export const getCustomerById = async (id: string) => {
    const result = await db.query("SELECT * FROM customers WHERE id = $1", [id]);
    return result.rows[0];
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
    } = data;

    // Convert empty strings to null for UUID fields
    const sanitizedManagerId = managerId?.trim() || null;
    const sanitizedDepartmentId = departmentId?.trim() || null;

    const result = await db.query(
        `INSERT INTO customers (
            name, contact_name, email, phone, address, status, website, 
            description, type, manager_id, department_id, service_categories, 
            category, notes, created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
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
        ]
    );
    return result.rows[0];
};

export const updateCustomer = async (id: string, data: any) => {
    const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");
    const values = Object.values(data);
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
