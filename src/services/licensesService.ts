import { db } from "../db/init";

// Get all licenses
export const getAllLicenses = async () => {
    const res = await db.query("SELECT * FROM software_licenses ORDER BY created_at DESC");
    return res.rows;
};

// Get license by ID
export const getLicenseById = async (id: string) => {
    const res = await db.query("SELECT * FROM software_licenses WHERE id = $1", [id]);
    return res.rows[0];
};

// Create license
export const createLicense = async (data: any) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const params = fields.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO software_licenses (${fields.join(", ")}) VALUES (${params}) RETURNING *`;
    const res = await db.query(query, values);
    return res.rows[0];
};

// Update license
export const updateLicense = async (id: string, data: any) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
    const query = `UPDATE software_licenses SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
    values.push(id);
    const res = await db.query(query, values);
    return res.rows[0];
};

// Delete license
export const deleteLicense = async (id: string) => {
    await db.query("DELETE FROM software_licenses WHERE id = $1", [id]);
};

// Get license assignments
export const getLicenseAssignments = async (licenseId: string) => {
    const res = await db.query(
        "SELECT * FROM license_assignments WHERE license_id = $1 ORDER BY assigned_date DESC",
        [licenseId]
    );
    return res.rows;
};

// Assign license to user
export const assignLicenseToUser = async (licenseId: string, userId: string, expires_date?: string, notes?: string) => {
    const res = await db.query(
        `INSERT INTO license_assignments (license_id, user_id, expires_date, notes)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [licenseId, userId, expires_date || null, notes || null]
    );
    // Increment assigned_seats
    await db.query(
        "UPDATE software_licenses SET assigned_seats = assigned_seats + 1 WHERE id = $1",
        [licenseId]
    );
    return res.rows[0];
};

// Unassign license from user
export const unassignLicenseFromUser = async (licenseId: string, userId: string) => {
    await db.query(
        "DELETE FROM license_assignments WHERE license_id = $1 AND user_id = $2",
        [licenseId, userId]
    );
    // Decrement assigned_seats
    await db.query(
        "UPDATE software_licenses SET assigned_seats = GREATEST(assigned_seats - 1, 0) WHERE id = $1",
        [licenseId]
    );
};