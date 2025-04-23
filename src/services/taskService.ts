import { db } from "../db/init";

export const getAllTasks = async () => {
    const result = await db.query("SELECT * FROM tasks ORDER BY created_at DESC");
    return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        assignedTo: row.assigned_to,
        createdBy: row.created_by,
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
    }));
};

export const getTaskById = async (id: string) => {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
    const row = result.rows[0];
    if (!row) return null;

    let assignedToName = null;
    if (row.is_user_assignee) {
        // assigned_to refers to user
        const userRes = await db.query("SELECT first_name, last_name FROM users WHERE id = $1", [row.assigned_to]);
        if (userRes.rows[0]) {
            assignedToName = `${userRes.rows[0].first_name} ${userRes.rows[0].last_name}`;
        }
    } else {
        // assigned_to refers to customer
        const custRes = await db.query("SELECT name FROM customers WHERE id = $1", [row.assigned_to]);
        if (custRes.rows[0]) {
            assignedToName = custRes.rows[0].name;
        }
    }

    return {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        priority: row.priority,
        assignedTo: row.assigned_to,
        assignedToName: assignedToName,
        isUserAssignee: row.is_user_assignee,
        createdBy: row.created_by,
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
    const {
        isUserAssignee, // camelCase from frontend
    } = data;

    const mapped = mapTaskData(data);

    // Ensure is_user_assignee is always set (default to true or false as needed)
    mapped.is_user_assignee = 
        typeof data.isUserAssignee === "boolean" ? data.isUserAssignee : true; // or false, depending on your logic

    const result = await db.query(
        `INSERT INTO tasks (
            title, description, status, priority, created_by, assigned_to, start_date, due_date, closed_date,
            recurrence, created_at, updated_at, completed_at, _local_only, _local_modified, _pending_deletion, tags, is_user_assignee
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
            mapped.is_user_assignee, // <-- always set
        ]
    );
    return result.rows[0];
};

export const updateTask = async (id: string, data: any) => {
    const mapped = mapTaskData(data);
    if ('isUserAssignee' in data) {
        mapped.is_user_assignee = data.isUserAssignee;
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

export const deleteTask = async (id: string) => {
    await db.query("DELETE FROM tasks WHERE id = $1", [id]);
};
