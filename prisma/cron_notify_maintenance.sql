-- SQL script for pg_cron: create notifications one day before scheduled maintenance
INSERT INTO notifications (user_id, message, type, created_at, updated_at)
SELECT 
    m.mechanic_id AS user_id,
    CONCAT('Maintenance scheduled for asset ID ', m.asset_id, ' is due tomorrow (', TO_CHAR(m.scheduled_date, 'YYYY-MM-DD'), ').') AS message,
    'PEMELIHARAAN' AS type,
    NOW() AS created_at,
    NOW() AS updated_at
FROM maintenances m
WHERE m.scheduled_date::date = (CURRENT_DATE + INTERVAL '1 day')::date
  AND NOT EXISTS (
    SELECT 1 FROM notifications n
    WHERE n.user_id = m.mechanic_id
      AND n.type = 'PEMELIHARAAN'
      AND n.message LIKE CONCAT('%', TO_CHAR(m.scheduled_date, 'YYYY-MM-DD'), '%')
      AND n.created_at::date = CURRENT_DATE
);
