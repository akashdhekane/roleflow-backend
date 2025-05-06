import { db } from "../db/init";

// Helper to map DB keys to frontend keys
const dbToFrontendMap: Record<string, string> = {
    app_name: "appName",
    inventory_module_enabled: "inventoryModuleEnabled",
    customer_module_enabled: "customerModuleEnabled",
    vendor_module_enabled: "vendorModuleEnabled",
    task_status_options: "taskStatusOptions",
    users_with_inventory_access: "usersWithInventoryAccess",
    notification_settings: "notificationSettings"
};

const frontendToDbMap = Object.fromEntries(
    Object.entries(dbToFrontendMap).map(([k, v]) => [v, k])
);

export const getAllSettings = async () => {
    const res = await db.query("SELECT * FROM settings ORDER BY key ASC");
    const settings: any = {
        id: "settings-1"
    };
    res.rows.forEach(row => {
        const frontendKey = dbToFrontendMap[row.key];
        if (frontendKey) {
            settings[frontendKey] = row.value;
        }
        if (row.key === "app_name") {
            settings.createdAt = row.created_at;
            settings.updatedAt = row.updated_at;
        }
    });
    return settings;
};

export const getSettingByKey = async (key: string) => {
    const res = await db.query("SELECT * FROM settings WHERE key = $1", [key]);
    return res.rows[0];
};

export const updateMultipleSettings = async (data: any) => {
    for (const frontendKey in data) {
        if (frontendToDbMap[frontendKey]) {
            await db.query(
                "UPDATE settings SET value = $1 WHERE key = $2",
                [JSON.stringify(data[frontendKey]), frontendToDbMap[frontendKey]]
            );
        }
    }
    return getAllSettings();
};

export const updateSettingByKey = async (key: string, value: any) => {
    const res = await db.query(
        "UPDATE settings SET value = $1 WHERE key = $2 RETURNING *",
        [JSON.stringify(value), key]
    );
    return res.rows[0];
};

export const deleteSettingByKey = async (key: string) => {
    // Check if system setting
    const res = await db.query("SELECT is_system FROM settings WHERE key = $1", [key]);
    if (res.rows[0]?.is_system) {
        throw new Error("System settings cannot be deleted");
    }
    await db.query("DELETE FROM settings WHERE key = $1", [key]);
    return { success: true, message: "Setting deleted successfully" };
};