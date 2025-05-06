import { db } from "../db/init";

// Get all permissions
export const getAllPermissions = async () => {
    const res = await db.query("SELECT * FROM permissions ORDER BY name ASC");
    return res.rows;
};

// Get all roles with their permissions
export const getAllRoles = async () => {
    const res = await db.query("SELECT * FROM roles ORDER BY name ASC");
    const roles = res.rows;

    // Get permissions for each role
    for (const role of roles) {
        const permsRes = await db.query(
            `SELECT permission_id FROM role_permissions WHERE role_id = $1`,
            [role.id]
        );
        role.permissions = permsRes.rows.map(r => r.permission_id);
    }
    return roles;
};

// Get permissions for a specific role
export const getRolePermissions = async (roleId: string) => {
    const roleRes = await db.query("SELECT * FROM roles WHERE id = $1", [roleId]);
    if (!roleRes.rows[0]) return null;
    const permsRes = await db.query(
        `SELECT p.* FROM permissions p
         JOIN role_permissions rp ON rp.permission_id = p.id
         WHERE rp.role_id = $1`,
        [roleId]
    );
    return {
        role: roleRes.rows[0],
        permissions: permsRes.rows
    };
};