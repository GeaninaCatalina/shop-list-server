const express = require('express'); 
const app = express(); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const PORT = process.env.PORT || 4100; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbUrl = 'mongodb://geanina:password1@ds155747.mlab.com:55747/shopping-list'; 

mongoose.connect(dbUrl , { useNewUrlParser: true },  (err) => { 
    console.log('data base connected',err);
 },
 { useUnifiedTopology: true }
 )

const Users = mongoose.model('Users', { userName: String, pasword:String });
const ShoppingLists = mongoose.model('ShoppingLists', { listName:String, products:String}); 

app.get('/login',(req, res)=> {
    Users.find({}, (err, userName)=> {
        console.log(req.body)
        res.send(true);
    })
})


app.listen(4100, () => console.log(`You app is listening on port ${PORT}`));