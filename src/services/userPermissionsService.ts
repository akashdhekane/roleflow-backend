import { db } from "../db/init";

// Helper: Get user's roles
async function getUserRoles(userId: string) {
    const res = await db.query(
        "SELECT role_id FROM user_roles WHERE user_id = $1",
        [userId]
    );
    return res.rows.map(r => r.role_id);
}

// Helper: Get permission UUID by name
async function getPermissionIdByName(permissionName: string) {
    const res = await db.query(
        "SELECT id FROM permissions WHERE name = $1",
        [permissionName]
    );
    return res.rows[0]?.id;
}

// 1. Check if user has a specific permission
export const checkUserPermission = async (userId: string, permissionName: string) => {
    // Check if user exists and get role
    const userRes = await db.query("SELECT id, role FROM users WHERE id = $1", [userId]);
    if (!userRes.rows[0]) return { error: true, message: "User not found", status: 404 };

    const user = userRes.rows[0];
    if (user.role === "SuperAdmin") {
        return { hasPermission: true, permissionId: permissionName, userId };
    }

    const permissionId = await getPermissionIdByName(permissionName);
    if (!permissionId) return { error: true, message: "Permission not found", status: 404 };

    // Check user-specific override
    const userPermRes = await db.query(
        "SELECT granted FROM user_permissions WHERE user_id = $1 AND permission_id = $2",
        [userId, permissionId]
    );
    if (userPermRes.rows[0]) {
        return {
            hasPermission: !!userPermRes.rows[0].granted,
            permissionId: permissionName,
            userId
        };
    }

    // Check role permissions
    const roles = await getUserRoles(userId);
    if (roles.length === 0) return { hasPermission: false, permissionId: permissionName, userId };

    const rolePermRes = await db.query(
        `SELECT 1 FROM role_permissions WHERE role_id = ANY($1) AND permission_id = $2 LIMIT 1`,
        [roles, permissionId]
    );
    return {
        hasPermission: !!rolePermRes.rows[0],
        permissionId: permissionName,
        userId
    };
};

// 2. Get all permissions for a user
export const getUserPermissions = async (userId: string) => {
    // Check if user exists and get role
    const userRes = await db.query("SELECT id, first_name, last_name, role FROM users WHERE id = $1", [userId]);
    if (!userRes.rows[0]) return { error: true, message: "User not found", status: 404 };

    const user = userRes.rows[0];
    if (user.role === "SuperAdmin") {
        // SuperAdmin: all permissions
        const allPerms = await db.query("SELECT name FROM permissions");
        return {
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role
            },
            permissions: allPerms.rows.map(r => r.name)
        };
    }

    // Get permission overrides
    const userPerms = await db.query(
        "SELECT permission_id, granted FROM user_permissions WHERE user_id = $1",
        [userId]
    );
    const overrides = Object.fromEntries(userPerms.rows.map(r => [r.permission_id, r.granted]));

    // Get all role permissions
    const roles = await getUserRoles(userId);
    let rolePerms: string[] = [];
    if (roles.length > 0) {
        const rolePermRes = await db.query(
            `SELECT p.name, rp.permission_id FROM role_permissions rp
             JOIN permissions p ON p.id = rp.permission_id
             WHERE rp.role_id = ANY($1)`,
            [roles]
        );
        rolePerms = rolePermRes.rows.map(r => r.name);
    }

    // Apply overrides
    const allPerms = await db.query("SELECT id, name FROM permissions");
    const permissions: string[] = [];
    for (const perm of allPerms.rows) {
        if (overrides.hasOwnProperty(perm.id)) {
            if (overrides[perm.id]) permissions.push(perm.name);
        } else if (rolePerms.includes(perm.name)) {
            permissions.push(perm.name);
        }
    }

    return {
        user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role
        },
        permissions
    };
};

// 3. Get all permission definitions
export const getPermissionDefinitions = async () => {
    const res = await db.query(
        "SELECT id, name, description FROM permissions ORDER BY name ASC"
    );
    return res.rows;
};

export const getAllRolePermissions = async () => {
    // Get all roles
    const rolesRes = await db.query("SELECT id FROM roles ORDER BY id ASC");
    const roles = rolesRes.rows.map(r => r.id);

    // Get all permissions
    const permsRes = await db.query("SELECT id, name FROM permissions");
    const allPerms = permsRes.rows;

    // For each role, get permission names
    const result = [];
    for (const roleId of roles) {
        // SuperAdmin: all permissions
        if (roleId === "SuperAdmin") {
            result.push({
                roleId,
                permissions: allPerms.map(p => p.name)
            });
        } else {
            const rpRes = await db.query(
                `SELECT p.name FROM role_permissions rp
                 JOIN permissions p ON p.id = rp.permission_id
                 WHERE rp.role_id = $1`,
                [roleId]
            );
            result.push({
                roleId,
                permissions: rpRes.rows.map(r => r.name)
            });
        }
    }
    return result;
};

export const updateRolePermissions = async (rolePermissionsArr: Array<{ roleId: string, permissions: string[] }>) => {
    // Get all permission name to id mapping
    const permsRes = await db.query("SELECT id, name FROM permissions");
    const permNameToId = Object.fromEntries(permsRes.rows.map(r => [r.name, r.id]));

    for (const { roleId, permissions } of rolePermissionsArr) {
        // Remove all existing permissions for this role
        await db.query("DELETE FROM role_permissions WHERE role_id = $1", [roleId]);
        // Insert new permissions
        for (const permName of permissions) {
            const permId = permNameToId[permName];
            if (permId) {
                await db.query(
                    "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
                    [roleId, permId]
                );
            }
        }
    }
    // Return the updated role-permissions mapping
    return await exports.getAllRolePermissions();
};