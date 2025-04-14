import { db } from "../db/init";
import bcrypt from 'bcryptjs';


export const getAllUsers = async () => {
    try {
        const result = await db.query("SELECT id, first_name, last_name, email, role, department_id, manager_id, created_at FROM users ORDER BY created_at DESC");
        if (!result.rows) {
            throw new Error('No users found');
        }
        // Map the rows to ensure proper JSON structure
        const users = result.rows.map(row => ({
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            role: row.role,
            departmentId: row.department_id,
            managerId: row.manager_id,
            createdAt: row.created_at
        }));
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async (id: string) => {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
};

export const createUser = async (data: any) => {
    try {
        const {
            firstName,
            lastName,
            email,
            role,
            managerId,
            password
        } = data;

        // Fetch department ID from manager's record if managerId is provided
        let departmentId = null;
        if (managerId) {
            const managerResult = await db.query(
                "SELECT department_id FROM users WHERE id = $1",
                [managerId]
            );
            if (managerResult.rows.length > 0) {
                departmentId = managerResult.rows[0].department_id;
            } else {
                throw new Error('Manager not found');
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            `INSERT INTO users (first_name, last_name, email, role, department_id, manager_id, password_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [firstName, lastName, email, role, departmentId, managerId, hashedPassword]
        );

        // Ensure the response is properly formatted
        const user = result.rows[0];
        if (!user) {
            throw new Error('User creation failed: No data returned');
        }

        return {
            status: 201,
            data: user
        };
    } catch (error: any) {
        if (error.code === '22P02') {
            throw new Error('Invalid department ID format. Must be a valid UUID');
        }
        throw error;
    }
};

export const updateUser = async (id: string, data: any) => {
    const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");

    const values = Object.values(data);
    values.push(id);

    const result = await db.query(
        `UPDATE users SET ${fields} WHERE id = $${values.length} RETURNING *`,
        values
    );

    return result.rows[0];
};

export const deleteUser = async (id: string) => {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
};


export const getReportingPeoples = async (userId: string) => {
    const query = `
        WITH RECURSIVE role_hierarchy AS (
            SELECT 'SuperAdmin' AS role, 5 AS role_level UNION ALL
            SELECT 'GroupLeader', 4 UNION ALL
            SELECT 'Admin', 4 UNION ALL
            SELECT 'DepartmentManager', 3 UNION ALL
            SELECT 'Manager', 2 UNION ALL
            SELECT 'Employee', 1
        ),
        current_user_info AS (
            SELECT 
                u.id AS current_user_id,
                u.role AS current_user_role,
                rh.role_level AS current_user_level,
                u.department_id AS current_department_id
            FROM public.users u
            JOIN role_hierarchy rh ON u.role = rh.role
            WHERE u.id = $1
        ),
        users_with_roles AS (
            SELECT 
                u.*,
                rh.role_level,
                d.name AS department_name
            FROM public.users u
            JOIN role_hierarchy rh ON u.role = rh.role
            LEFT JOIN public.departments d ON u.department_id = d.id
        ),
        recursive_reports AS (
            SELECT 
                uwr.* 
            FROM users_with_roles uwr
            JOIN current_user_info cui ON uwr.manager_id = cui.current_user_id
            WHERE uwr.role_level < cui.current_user_level
                AND (
                    cui.current_user_role != 'Admin' OR uwr.department_id = cui.current_department_id
                )
            UNION ALL
            SELECT 
                uwr.* 
            FROM users_with_roles uwr
            JOIN recursive_reports r ON uwr.manager_id = r.id
            JOIN current_user_info cui ON TRUE
            WHERE uwr.role_level < cui.current_user_level
                AND (
                    cui.current_user_role != 'Admin' OR uwr.department_id = cui.current_department_id
                )
        )
        SELECT * FROM recursive_reports;
    `;

    const result = await db.query(query, [userId]);
    const reportingPeoples = result.rows.map(row => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        role: row.role,
        departmentId: row.department_id,
        managerId: row.manager_id,
        createdAt: row.created_at,
        departmentName: row.department_name // Assuming department_name is part of the query result
    }));
    return reportingPeoples;
};
