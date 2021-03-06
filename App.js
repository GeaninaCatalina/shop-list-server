const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4100;
const dbUrl = require('./db.conection.json').url;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  const allowedOrigins = ['http://127.0.0.1:4100', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, DELETE, PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  return next();
});

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  console.log('data base connected', err);
});

const UsersConnector = mongoose.model('users', { userName: String, password: String });
const ShoppingListsConnector = mongoose.model('shopping-lists', { listName: String, content: String });



app.post('/login', (req, res) => {
  const user = req.body.userName;
  const password = req.body.password;

  UsersConnector.find({ userName: user, password: password }, (err, users) => {
    const foundUsers = users.filter(element => element.userName === user && element.password === password);

    if (foundUsers.length === 0) {
      res.send(false);
    } else {
      res.send(true);
    }
  })
})


app.post('/signin', (req, res) => {
  const newUser = new UsersConnector(req.body);

  const user = req.body.userName;
  const password = req.body.password;

  UsersConnector.find({ userName: user, password: password }, (err, users) => {
    const foundExistingUsers = users.filter(element => element.userName === user && element.password === password);

    if (foundExistingUsers.length === 0) {
      newUser.save();
      res.send(true);
    } else {
      res.send(false);
    }
  })
})

app.post('/list', (req, res) => {
  const newList = new ShoppingListsConnector(req.body);

  newList.save((err) => {
    if(err) {
      res.sendStatus(500);
    }
  })
  res.send(newList); 
 
})

app.put('/list', (req, res) => {
  const newList = req.body;
  console.log(req.body);
  ShoppingListsConnector.findOneAndUpdate({_id: newList._id}, newList, (err) => {
    if (err) return res.send(500, {error: err});
    return res.send('Succesfully saved.');
  });
})

app.delete('/list/:id', (req, res) => {
  console.log(req.params.id);
  ShoppingListsConnector.deleteOne({_id: req.params.id}, (err) => {
    if (!err) {
      console.log('Entry deleted');
      res.sendStatus(200);
    } else {
      console.log('Entry not deleted');
      res.sendStatus(500);
    }
  });
});


app.get('/list', function (req, res) {
  ShoppingListsConnector.find({}, (err, lists) => {
    res.send(lists.map(list => { return { _id: list._id, listName: list.listName, content: list.content } }));
  });
});

app.listen(4100, () => console.log(`You app is listening on port ${PORT}`));