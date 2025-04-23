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
    return result.rows.map(row => ({
        id: row.id,
        taskId: row.task_id,
        fileName: row.file_name,
        fileType: row.file_type,
        fileSize: row.file_size,
        url: row.url,
        uploadedBy: row.uploaded_by,
        uploadedByName: row.uploaded_by_name,
        uploadedAt: row.uploaded_at,
    }));
};

export const updateTaskAttachment = async (
    id: string,
    data: Partial<{
        fileName: string;
        fileType: string;
        fileSize: number;
        url: string;
    }>
) => {
    const fieldMap: Record<string, string> = {
        fileName: "file_name",
        fileType: "file_type",
        fileSize: "file_size",
    };

    const filteredEntries = Object.entries(data).filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
    );

    const dbData = filteredEntries.reduce((acc, [key, value]) => {
        const dbKey = fieldMap[key] || key;
        acc[dbKey] = value;
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
        `UPDATE task_attachments SET ${fields} WHERE id = $${values.length} RETURNING *`,
        values
    );
    return result.rows[0];
};

export const deleteTaskAttachment = async (id: string) => {
    await db.query("DELETE FROM task_attachments WHERE id = $1", [id]);
};
