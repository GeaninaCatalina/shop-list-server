const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4100;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  const allowedOrigins = ['http://127.0.0.1:4100', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  return next();
});

var dbUrl = 'mongodb://geanina:password1@ds155747.mlab.com:55747/shopping-list';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  console.log('data base connected', err);
});

const UsersConnector = mongoose.model('users', { userName: String, password: String });
const ShoppingListsConnector = mongoose.model('shopping-lists', { listName: String });

//const user = new UsersConnector({ userName: 'nume', pasword:'1234534' });
//user.save()

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
   
    if (foundExistingUsers.length === 0){
      newUser.save();
      res.send(true);
    } else {
      res.send(false);
    }
  })
})

app.post('/savelist', (req, res) => {
 const newList = new ShoppingListsConnector(req.body);
  newList.save(); 
  res.send('OK');  
})


app.get('/getlists', function (req, res) {
    ShoppingListsConnector.find((err, lists) => {
      console.log(lists);
      res.send(lists.map(list => {return (list.listName)}));
    });
});

app.listen(4100, () => console.log(`You app is listening on port ${PORT}`));