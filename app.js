// load modules
const express = require('express');
const cors = require('cors');
const pool = require('./db');

// create express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes

// create todo route
app.post('/todos/create_todo', async (req, res) => {
    try {
        const { description, selectedcategory } = req.body;
        const sql = `INSERT INTO todo(todo_desc, todo_date, category_id, todo_remarks) VALUES($1,CURRENT_DATE, $2, 'In Progress') RETURNING *`;
        const data = [description, selectedcategory];

        const query_response = await pool.query(sql, data);
        res.json({ message: 'Todo was created successfully' });
    } catch (err) {
        console.error(err.message);
    }
});

// get all todos
app.get('/todos', async (req, res) => {
    try {
        const query_response = await pool.query('SELECT * FROM todo');
        res.json(query_response.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get todo list from view
app.get('/todo_list', async (req, res) => {
    try {
        const query_response = await pool.query('SELECT * FROM todo_list');
        res.json(query_response.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get all category
app.get('/categories', async (req, res) => {
    try {
        const query_response = await pool.query('SELECT * FROM category');
        res.json(query_response.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get a todo
app.get('/todos/get_todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = [id];

        const query_response = await pool.query('SELECT * FROM todo WHERE todo_id = $1', data);
        res.json(query_response.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// update todo
app.put('/todos/update_todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const sql = 'UPDATE todo SET todo_desc = $1 WHERE todo_id = $2';
        const data = [description, id];

        const query_response = await pool.query(sql, data);
        res.json({ message: 'Todo was updated successfully!' });
    } catch (err) {
        console.error(err.message);
    }
});

// update remarks route
app.put('/todos/update_remarks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body;

        const sql = 'UPDATE todo SET todo_remarks = $1 WHERE todo_id = $2';
        const data = [remarks, id];

        const query_response = await pool.query(sql, data);
        res.json({ message: 'Todo remarks was updated successfully!' });
    } catch (err) {
        console.error(err.message);
    }
});

// delete todo
app.delete('/todos/delete_todo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = [id];

        const query_response = await pool.query('DELETE FROM todo WHERE todo_id = $1', data);
        res.json({ message: 'Todo was deleted successfully!' });
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(5000, () => console.log('server is now listening at PORT 5000...'));
