const express = require('express');
const pool = require('../db');
const router = express.Router();

router.get('/hours', async (_req, res) => {
    try {
      const sql = `
        SELECT pr.id AS professor_id,
               pr.name AS professor_name,
               SUM(EXTRACT(EPOCH FROM (cs.end_time - cs.start_time)) / 3600) AS total_hours
        FROM professor pr
        JOIN class c           ON c.professor_id = pr.id
        JOIN class_schedule cs ON cs.class_id = c.id
        GROUP BY pr.id, pr.name
        ORDER BY total_hours DESC;
      `;
      const { rows } = await pool.query(sql);
      const formattedRows = rows.map(row => ({
        ...row,
        total_hours: Number(row.total_hours).toFixed(2)
      }));
      res.json(formattedRows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving professor hours' });
    }
  });

module.exports = router;
