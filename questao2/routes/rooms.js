const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/schedule', async (req, res) => {
  const day = req.query.day; 
  try {
    const sql = `
      SELECT r.id          AS room_id,
             r.name        AS room_name,
             cs.day_of_week,
             cs.start_time,
             cs.end_time,
             c.id          AS class_id,
             s.code        AS subject_code,
             s.name        AS subject_name
      FROM room r
      LEFT JOIN class_schedule cs ON cs.room_id = r.id
      LEFT JOIN class c           ON c.id = cs.class_id
      LEFT JOIN subject s         ON s.id = c.subject_id
      ${day ? 'WHERE cs.day_of_week = $1' : ''}
      ORDER BY r.name, cs.day_of_week, cs.start_time;
    `;
    const params = day ? [day] : [];
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving room schedules' });
  }
});

module.exports = router;
