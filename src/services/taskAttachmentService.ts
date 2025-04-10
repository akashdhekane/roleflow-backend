import { db } from "../db/init";

export const createTaskAttachment = async (data: {
    taskId: string;
    fileName: string;
    fileType: string;
    fileSize?: number;
    url: string;
    uploadedBy: string;
}) => {
    const result = await db.query(
        `
    INSERT INTO task_attachments (task_id, file_name, file_type, file_size, url, uploaded_by, uploaded_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
    `,
        [data.taskId, data.fileName, data.fileType, data.fileSize || 0, data.url, data.uploadedBy]
    );
    return result.rows[0];
};

export const getAttachmentsByTaskId = async (taskId: string) => {
    const result = await db.query(
        `
    SELECT ta.*, u.first_name || ' ' || u.last_name AS uploaded_by_name
    FROM task_attachments ta
    JOIN users u ON ta.uploaded_by = u.id
    WHERE ta.task_id = $1
    ORDER BY ta.uploaded_at ASC
    `,
        [taskId]
    );
    return result.rows;
};

export const updateTaskAttachment = async (
    id: string,
    data: Partial<{ fileName: string; fileType: string; fileSize?: number; url: string }>
) => {
    const result = await db.query(
        `
    UPDATE task_attachments
    SET file_name = COALESCE($1, file_name),
        file_type = COALESCE($2, file_type),
        file_size = COALESCE($3, file_size),
        url = COALESCE($4, url)
    WHERE id = $5
    RETURNING *
    `,
        [data.fileName, data.fileType, data.fileSize || 0, data.url, id]
    );
    return result.rows[0];
};

export const deleteTaskAttachment = async (id: string) => {
    await db.query("DELETE FROM task_attachments WHERE id = $1", [id]);
};
