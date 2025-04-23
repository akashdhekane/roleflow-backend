import { db } from "../db/init";

export const createTaskComment = async (data: {
    taskId: string;
    content: string;
    createdBy: string;
}) => {
    const result = await db.query(
        `INSERT INTO task_comments (task_id, content, created_by, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *`,
        [data.taskId, data.content, data.createdBy]
    );
    return result.rows[0];
};

export const updateTaskComment = async (id: string, data: any) => {
    const filteredEntries = Object.entries(data).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
    );

    const dbData = filteredEntries.reduce((acc, [key, value]) => {
        acc[key] = value;
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
        `UPDATE task_comments SET ${fields} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return result.rows[0];
};

export const getCommentsByTaskId = async (taskId: string) => {
    const result = await db.query(
        `
    SELECT tc.*, u.first_name || ' ' || u.last_name AS user_name
    FROM task_comments tc
    JOIN users u ON tc.created_by = u.id
    WHERE tc.task_id = $1
    ORDER BY tc.created_at ASC
    `,
        [taskId]
    );
    return result.rows.map(row => ({
        id: row.id,
        taskId: row.task_id,
        content: row.content,
        createdBy: row.created_by,
        userName: row.user_name,
        createdAt: row.created_at,
    }));
};

// Removed duplicate updateTaskComment function

export const deleteTaskComment = async (id: string) => {
    await db.query("DELETE FROM task_comments WHERE id = $1", [id]);
};
