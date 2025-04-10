import { db } from "../db/init";

export const getAllTasks = async () => {
    const result = await db.query("SELECT * FROM tasks ORDER BY created_at DESC");
    return result.rows;
};

export const getTaskById = async (id: string) => {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
};

export const createTask = async (data: any) => {
    const {
        title,
        description,
        status,
        priority,
        assignedTo,
        createdBy,
        dueDate,
        completedAt,
        tags,
        startDate,
        recurrence,
        closedDate,
        _localOnly,
        _localModified,
        _pendingDeletion,
    } = data;

    const result = await db.query(
        `INSERT INTO tasks (
      title, description, status, priority, assigned_to, created_by,
      due_date, completed_at, tags, start_date, recurrence, closed_date,
      _local_only, _local_modified, _pending_deletion
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15
    ) RETURNING *`,
        [
            title,
            description,
            status,
            priority,
            assignedTo,
            createdBy,
            dueDate,
            completedAt,
            tags,
            startDate,
            recurrence,
            closedDate,
            _localOnly ?? false,
            _localModified ?? false,
            _pendingDeletion ?? false,
        ]
    );

    return result.rows[0];
};

export const updateTask = async (id: string, data: any) => {
    const fields = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");
    const values = Object.values(data);
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
