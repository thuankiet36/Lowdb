// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({activities: []})
  .write()

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.send('I love CodersX');
});

app.get('/todos', (request, response) => {
  response.render('index.pug', {
    activities: db.get('activities').value()
  });
});

app.get('/todos/search', (request, response) => {
  var q = request.query.q;
  var matchActivity = db.get('activities').value().filter(activity => {
    return activity.todo.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  })
  response.render('index.pug', {
    activities: matchActivity
  });
});

app.get('/todos/create', (request, response) => {
  response.render('create.pug');
})

app.post('/todos/create', (request, response) => {
  db.get('activities').push(request.body).write();
  response.redirect('/todos');
})

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
