const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbtareas'
});


// ? CONFIG

app.set('port', 4000);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));


// ? MIDDLEWARES
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ? STATIC FILES
app.use('/static', express.static(path.join(__dirname, 'public')));

// ? HTTP METHODS
app.get("/", (req, res) => {
    conn.query('SELECT * FROM tasks', (error, rows, fields) => {
        res.render("index.html", {
            title: "Notebook",
            data: rows,
            fields: fields
        });
    })
});

app.post("/createTask", (req, res, next) => {
    let taskN = req.body.taskName;
    let description = req.body.description;

    // console.log(taskN);
    // console.log(description);
    if(taskN && description) {
        conn.query('INSERT INTO tasks(taskName, description) values(?,?)', [taskN, description], (error, rows, fields) => {
        })
    }

    res.redirect("/");
});


app.get("/updateTask/(:id)", (req, res, next) => {
    const id = req.params.id;
    conn.query('SELECT * FROM tasks where id = ?', [id], (error, rows, fields) => {
        res.render("update.html", {
            data: rows[0]
        });
    })
});

app.post("/updateTask/(:id)", (req, res, next) => {
    const id = req.params.id;
    const taskN = req.body.taskName;
    const description = req.body.description;

    if(taskN && description) {
        conn.query('UPDATE tasks SET taskName = ?, description = ? where id = ?', [taskN, description, id], (error, rows, fields) => {
        })
    }

    res.redirect("/");
});

app.get("/deleteTask/:id", (req, res, next) => {
    const id = req.params.id;

    console.log(id);

    conn.query('DELETE from tasks where id = ?', [id], (error, rows, fields) => {
        console.log(rows);
    })

    res.redirect("/");
});

// ? LISTENING PORT
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});