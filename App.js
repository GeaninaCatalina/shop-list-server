const express = require('express'); 
const app = express(); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const PORT = process.env.PORT || 4100; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbUrl = 'mongodb://geanina:password1@ds155747.mlab.com:55747/shopping-list'; 

mongoose.connect(dbUrl , { useNewUrlParser: true, useUnifiedTopology: true },  (err) => { 
    console.log('data base connected',err);
 });

const UsersConnector = mongoose.model('users', { userName: String, pasword:String });
const ShoppingListsConnector = mongoose.model('shopping-lists', { listName:String, products:String}); 

//const user = new UsersConnector({ userName: 'nume', pasword:'1234534' });
//user.save()

app.get('/login',(req, res)=> {
    UsersConnector.find({}, (err, users)=> {
        console.log(users)
        res.send(true);
    })
})

app.listen(4100, () => console.log(`You app is listening on port ${PORT}`));