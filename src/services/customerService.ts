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
        type,
        company,
        industry,
        website,
        description,
        notes,
        accountManager,
        departmentId,
        customerSince,
        lastContactDate,
        tags,
        _localOnly,
        _localModified,
        _pendingDeletion,
    } = data;

    const result = await db.query(
        `INSERT INTO customers (
      name, contact_name, email, phone, address, status, type, company, industry,
      website, description, notes, account_manager, department_id, customer_since,
      last_contact_date, tags, _local_only, _local_modified, _pending_deletion
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20
    ) RETURNING *`,
        [
            name,
            contactName,
            email,
            phone,
            address,
            status,
            type,
            company,
            industry,
            website,
            description,
            notes,
            accountManager,
            departmentId,
            customerSince,
            lastContactDate,
            tags,
            _localOnly ?? false,
            _localModified ?? false,
            _pendingDeletion ?? false,
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
