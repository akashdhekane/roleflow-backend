import { db } from "../db/init";

export const getTaskHistoryByTaskId = async (taskId: string) => {
    const result = await db.query(
        `
    SELECT th.*, u.first_name || ' ' || u.last_name AS changed_by_name
    FROM task_history th
    JOIN users u ON th.changed_by = u.id
    WHERE th.task_id = $1
    ORDER BY th.changed_at DESC
    `,
        [taskId]
    );
    return result.rows;
};
