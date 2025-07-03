
const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await support
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { createPool } = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(cors());

const db = createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    connectionLimit: 10, // Adjust based on your requirements
    ssl: {
        rejectUnauthorized: false
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Handle the error appropriately, e.g., log it or send an alert
});

// Centralized database connection handling
process.on('SIGINT', async () => {
    await db.end();
    process.exit();
});

const getLastStudentID = async () => {
    const [result] = await db.query('SELECT MAX(id) AS lastID FROM student');
    const lastID = result[0].lastID || 0;
    return lastID;
};

const getLastteacherID = async () => {
    const [result] = await db.query('SELECT MAX(id) AS lastID FROM teacher');
    const lastID = result[0].lastID || 0;
    return lastID;
};

app.get('/', async (req, res) => {
  try {
      // Fetch data from the student table
      const [data] = await db.query("SELECT * FROM student");
      return res.json({ message: "From Backend!!!", studentData: data });
  } catch (error) {
      console.error('Error fetching student data:', error);
      return res.status(500).json({ error: 'Error fetching student data' });
  }
});

// Updated /student endpoint to handle filtering and sorting
app.get('/student', async (req, res) => {
    try {
        const { class: filterClass, sort = 'asc' } = req.query; // Default sort to 'asc'

        let sql = "SELECT * FROM student";
        const params = [];

        if (filterClass) {
            sql += " WHERE class LIKE ?";
            params.push(`%${filterClass}%`); // Use LIKE for partial matches
        }

        const sortOrder = sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC'; // Ensure valid sort order
        sql += ` ORDER BY name ${sortOrder}`;

        const [data] = await db.query(sql, params);
        return res.json(data);
    } catch (error) {
        console.error('Error fetching student data:', error);
        return res.status(500).json({ error: 'Error fetching student data' });
    }
});

// Updated /teacher endpoint to handle filtering and sorting
app.get('/teacher', async (req, res) => {
    try {
        const { subject: filterSubject, class: filterClass, sort = 'asc' } = req.query;

        let sql = "SELECT * FROM teacher";
        const params = [];
        const whereClauses = [];

        if (filterSubject) {
            whereClauses.push("subject LIKE ?");
            params.push(`%${filterSubject}%`);
        }
        if (filterClass) {
            whereClauses.push("class LIKE ?");
            params.push(`%${filterClass}%`);
        }

        if (whereClauses.length > 0) {
            sql += " WHERE " + whereClauses.join(" AND ");
        }

        const sortOrder = sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
        sql += ` ORDER BY name ${sortOrder}`;

        const [data] = await db.query(sql, params);
        return res.json(data);
    } catch (error) {
        console.error('Error fetching teacher data:', error);
        return res.status(500).json({ error: 'Error fetching teacher data' });
    }
});


app.post('/addstudent', async (req, res) => {
    try {
        const lastStudentID = await getLastStudentID();
        const nextStudentID = lastStudentID + 1;

        const studentData = {
            id: nextStudentID,
            name: req.body.name,
            roll_number: req.body.rollNo,
            class: req.body.class,
        };

        const sql = `INSERT INTO student (id, name, roll_number, class) VALUES (?, ?, ?, ?)`;
        await db.query(sql, [studentData.id, studentData.name, studentData.roll_number, studentData.class]);
        return res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error inserting data' });
    }
});

app.post('/addteacher', async (req, res) => {
    try {
        const lastteacherID = await getLastteacherID();
        const nextteacherID = lastteacherID + 1;

        const TeacherData = {
            id: nextteacherID,
            name: req.body.name,
            subject: req.body.subject,
            class: req.body.class,
        };

        const sql = `INSERT INTO teacher (id, name, subject, class) VALUES (?, ?, ?, ?)`;
        await db.query(sql, [TeacherData.id, TeacherData.name, TeacherData.subject, TeacherData.class]);
        return res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error inserting data' });
    }
});

app.delete('/student/:id', async (req, res) => {
    const studentId = req.params.id;
    const sqlDelete = 'DELETE FROM student WHERE id = ?';
    const sqlSelect = 'SELECT id FROM student ORDER BY id';

    try {
        await db.query(sqlDelete, [studentId]);

        // Re-sequence IDs after deletion (Optional, can be complex and impact performance)
        // Consider if this is truly necessary or if gaps in IDs are acceptable
        // const [rows] = await db.query(sqlSelect);
        // const updatePromises = rows.map(async (row, index) => {
        //     const newId = index + 1;
        //     await db.query('UPDATE student SET id = ? WHERE id = ?', [newId, row.id]);
        // });
        // await Promise.all(updatePromises);

        return res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        return res.status(500).json({ error: 'Error deleting student' });
    }
});

app.delete('/teacher/:id', async (req, res) => {
    const teacherID = req.params.id;
    const sqlDelete = 'DELETE FROM teacher WHERE id = ?';
    const sqlSelect = 'SELECT id FROM teacher ORDER BY id';

    try {
        await db.query(sqlDelete, [teacherID]);

        // Re-sequence IDs after deletion (Optional)
        // const [rows] = await db.query(sqlSelect);
        // const updatePromises = rows.map(async (row, index) => {
        //     const newId = index + 1;
        //     await db.query('UPDATE teacher SET id = ? WHERE id = ?', [newId, row.id]);
        // });
        // await Promise.all(updatePromises);

        return res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        return res.status(500).json({ error: 'Error deleting teacher' });
    }
});

app.listen(3500, () => {
    console.log("listening on Port 3500");
});

