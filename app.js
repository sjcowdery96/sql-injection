
//Privided code
const http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//privided code to initialize database
const db = new sqlite3.Database(':memory:');
db.serialize(function () {

    db.run(`CREATE TABLE user(username TEXT, password TEXT, title TEXT)`);
    db.run(`INSERT INTO user VALUES('AuthorizedAnnie', 'AuthorizedArthur', 'AdministrativeAdam')`);
});
//root get function to render our HTML index
app.get('/', function (req, res) {
    res.sendFile('index.html');
});

//post route to login (this is what our form sends to)
app.post('/login', function (req, res) {
    //extract data (without validating it) from the request
    var username = req.body.username;
    var password = req.body.password;
    //create a VERY unsafe query to throw right into our sqlite database
    var query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";

    db.get(query, function (err, row) {

        if (err) {
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>');
        }
    });

});

app.listen(process.env.PORT);

