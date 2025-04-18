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

export const updateTaskComment = async (id: string, content: string) => {
    const result = await db.query(
        `
    UPDATE task_comments
    SET content = $1
    WHERE id = $2
    RETURNING *
    `,
        [content, id]
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
    return result.rows;
};

// Removed duplicate updateTaskComment function

export const deleteTaskComment = async (id: string) => {
    await db.query("DELETE FROM task_comments WHERE id = $1", [id]);
};
