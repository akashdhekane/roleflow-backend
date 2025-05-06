import { db } from "../db/init";

export const getAllTasks = async () => {
    const result = await db.query("SELECT * FROM tasks ORDER BY created_at DESC");
    const tasks = await Promise.all(result.rows.map(async row => {
        let assignedToName = null;
        if (row.assignie_type === "user") {
            const userRes = await db.query(
                "SELECT first_name, last_name FROM users WHERE id = $1",
                [row.assigned_to]
            );
            if (userRes.rows[0]) {
                assignedToName = `${userRes.rows[0].first_name} ${userRes.rows[0].last_name}`;
            }
        } else if (row.assignie_type === "vendor") {
            const vendorRes = await db.query(
                "SELECT name FROM vendors WHERE id = $1",
                [row.assigned_to]
            );
            if (vendorRes.rows[0]) {
                assignedToName = vendorRes.rows[0].name;
            }
        } else if (row.assignie_type === "customer") {
            const custRes = await db.query(
                "SELECT name FROM customers WHERE id = $1",
                [row.assigned_to]
            );
            if (custRes.rows[0]) {
                assignedToName = custRes.rows[0].name;
            }
        }

        // Fetch createdByName from users table using created_by
        let createdByName = null;
        const creatorRes = await db.query(
            "SELECT first_name, last_name FROM users WHERE id = $1",
            [row.created_by]
        );
        if (creatorRes.rows[0]) {
            createdByName = `${creatorRes.rows[0].first_name} ${creatorRes.rows[0].last_name}`;
        }

        return {
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            priority: row.priority,
            assignedTo: row.assigned_to,
            assignedToName,
            assigneeType: row.assignie_type,
            createdBy: row.created_by,
            createdByName,
            dueDate: row.due_date,
            completedAt: row.completed_at,
            tags: row.tags,
            startDate: row.start_date,
            recurrence: row.recurrence,
            closedDate: row.closed_date,
            localOnly: row._local_only,
            localModified: row._local_modified,
            pendingDeletion: row._pending_deletion,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }));
    return tasks;
};

export const getTaskById = async (id: string) => {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
    const row = result.rows[0];
    if (!row) return null;

    let assignedToName = null;
    if (row.assignie_type === "user") {
        const userRes = await db.query(
            "SELECT first_name, last_name FROM users WHERE id = $1",
            [row.assigned_to]
        );
        if (userRes.rows[0]) {
            assignedToName = `${userRes.rows[0].first_name} ${userRes.rows[0].last_name}`;
        }
    } else if (row.assignie_type === "vendor") {
        const vendorRes = await db.query(
            "SELECT name FROM vendors WHERE id = $1",
            [row.assigned_to]
        );
        if (vendorRes.rows[0]) {
            assignedToName = vendorRes.rows[0].name;
        }
    } else if (row.assignie_type === "customer") {
        const custRes = await db.query(
            "SELECT name FROM customers WHERE id = $1",
            [row.assigned_to]
        );
        if (custRes.rows[0]) {
            assignedToName = custRes.rows[0].name;
        }
    }

    // Fetch createdByName from users table using created_by
    let createdByName = null;
    const creatorRes = await db.query(
        "SELECT first_name, last_name FROM users WHERE id = $1",
        [row.created_by]
    );
    if (creatorRes.rows[0]) {
        createdByName = `${creatorRes.rows[0].first_name} ${creatorRes.rows[0].last_name}`;
    }

    return {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        assignedTo: row.assigned_to,
        assignedToName: assignedToName,
        assigneeType: row.assignie_type,
        createdBy: row.created_by,
        createdByName: createdByName,
        dueDate: row.due_date,
        completedAt: row.completed_at,
        tags: row.tags,
        startDate: row.start_date,
        recurrence: row.recurrence,
        closedDate: row.closed_date,
        localOnly: row._local_only,
        localModified: row._local_modified,
        pendingDeletion: row._pending_deletion,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
};

export const getTasksByUserId = async (userId: string) => {
    const result = await db.query(
        "SELECT * FROM tasks WHERE assigned_to = $1 AND assignie_type = 'user' ORDER BY created_at DESC",
        [userId]
    );
    const tasks = await Promise.all(result.rows.map(async row => {
        let assignedToName = null;
        if (row.assignee_type === "user") {
            const userRes = await db.query(
                "SELECT first_name, last_name FROM users WHERE id = $1",
                [row.assigned_to]
            );
            if (userRes.rows[0]) {
                assignedToName = `${userRes.rows[0].first_name} ${userRes.rows[0].last_name}`;
            }
        } else if (row.assignee_type === "vendor") {
            const vendorRes = await db.query(
                "SELECT name FROM vendors WHERE id = $1",
                [row.assigned_to]
            );
            if (vendorRes.rows[0]) {
                assignedToName = vendorRes.rows[0].name;
            }
        } else if (row.assignee_type === "customer") {
            const custRes = await db.query(
                "SELECT name FROM customers WHERE id = $1",
                [row.assigned_to]
            );
            if (custRes.rows[0]) {
                assignedToName = custRes.rows[0].name;
            }
        }

        let createdByName = null;
        const creatorRes = await db.query(
            "SELECT first_name, last_name FROM users WHERE id = $1",
            [row.created_by]
        );
        if (creatorRes.rows[0]) {
            createdByName = `${creatorRes.rows[0].first_name} ${creatorRes.rows[0].last_name}`;
        }

        return {
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            priority: row.priority,
            assignedTo: row.assigned_to,
            assignedToName,
            assigneeType: row.assignee_type,
            createdBy: row.created_by,
            createdByName,
            dueDate: row.due_date,
            completedAt: row.completed_at,
            tags: row.tags,
            startDate: row.start_date,
            recurrence: row.recurrence,
            closedDate: row.closed_date,
            localOnly: row._local_only,
            localModified: row._local_modified,
            pendingDeletion: row._pending_deletion,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }));
    return tasks;
};

// Utility to map camelCase to snake_case for known fields
const fieldMap: Record<string, string> = {
    createdBy: "created_by",
    assignedTo: "assigned_to",
    startDate: "start_date",
    dueDate: "due_date",
    closedDate: "closed_date",
    recurrence: "recurrence",
    createdAt: "created_at",
    updatedAt: "updated_at",
    completedAt: "completed_at",
    localOnly: "_local_only",
    localModified: "_local_modified",
    pendingDeletion: "_pending_deletion",
    tags: "tags",
    // Add more mappings as needed
};

function mapTaskData(data: any) {
    const mapped: any = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const dbKey = fieldMap[key] || key;
            mapped[dbKey] = data[key];
        }
    }
    return mapped;
}

export const createTask = async (data: any) => {
    const mapped = mapTaskData(data);

    // Accept both camelCase and snake_case for assignee type
    mapped.assignie_type = data.assigneeType || data.assignie_type;

    const result = await db.query(
        `INSERT INTO tasks (
            title, description, status, priority, created_by, assigned_to, assignie_type, start_date, due_date, closed_date,
            recurrence, created_at, updated_at, completed_at, _local_only, _local_modified, _pending_deletion, tags
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING *`,
        [
            mapped.title,
            mapped.description,
            mapped.status,
            mapped.priority,
            mapped.created_by,
            mapped.assigned_to,
            mapped.assignie_type,
            mapped.start_date,
            mapped.due_date,
            mapped.closed_date,
            mapped.recurrence,
            mapped.created_at,
            mapped.updated_at,
            mapped.completed_at,
            mapped._local_only,
            mapped._local_modified,
            mapped._pending_deletion,
            mapped.tags,
        ]
    );
    return result.rows[0];
};

export const updateTask = async (id: string, data: any) => {
    const mapped = mapTaskData(data);
    if ('assigneeType' in data) {
        mapped.assignie_type = data.assigneeType;
    }

    // Remove id from update fields if present
    delete mapped.id;

    // Only update fields that are provided and not null/empty
    const filteredEntries = Object.entries(mapped).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
    );

    if (filteredEntries.length === 0) {
        throw new Error("No valid fields to update.");
    }

    const keys = filteredEntries.map(([key]) => key);
    const fields = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = filteredEntries.map(([, value]) => value);
    values.push(id);

    const result = await db.query(
        `UPDATE tasks SET ${fields} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return result.rows[0];
};

export const getVisibleTasksForUser = async (id: string) => {
    const query = `
      WITH cur_user AS (
        SELECT 
          u.id AS user_id,
          u.role,
          u.department_id,
          CASE u.role
            WHEN 'SuperAdmin' THEN 1
            WHEN 'Admin' THEN 2
            WHEN 'GroupLeader' THEN 3
            WHEN 'DepartmentManager' THEN 4
            WHEN 'Manager' THEN 5
            WHEN 'TeamLead' THEN 6
            WHEN 'Employee' THEN 7
            WHEN 'Contractor' THEN 8
            WHEN 'Guest' THEN 8
            ELSE 100
          END AS role_level
        FROM users u
        WHERE u.id = $1
      ),
      department_users AS (
        SELECT u.id
        FROM users u, cur_user cu
        WHERE u.department_id = cu.department_id
      ),
      reportees AS (
        SELECT u.id FROM users u WHERE u.manager_id = $1
      ),
      visible_tasks AS (
        SELECT t.*
        FROM tasks t, cur_user cu
        WHERE
          cu.role_level IN (1, 2) -- SuperAdmin and Admin see all
  
          OR (cu.role_level = 3 AND (
            t.assigned_to = cu.user_id
            OR t.assigned_to IN (SELECT id FROM department_users)
          ))
  
          OR (cu.role_level = 4 AND (
            t.assigned_to = cu.user_id
            OR t.assigned_to IN (SELECT id FROM department_users)
          ))
  
          OR (cu.role_level = 5 AND (
            t.assigned_to = cu.user_id
            OR t.assigned_to IN (SELECT id FROM department_users)
          ))
  
          OR (cu.role_level = 6 AND (
            t.assigned_to = cu.user_id
            OR t.assigned_to IN (SELECT id FROM reportees)
          ))
  
          OR (cu.role_level >= 7 AND t.assigned_to = cu.user_id)
      )
      SELECT * FROM visible_tasks;
    `;

    const { rows } = await db.query(query, [id]);
    return rows;
};

export const deleteTask = async (id: string) => {
    await db.query("DELETE FROM tasks WHERE id = $1", [id]);
};
