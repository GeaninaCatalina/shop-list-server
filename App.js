const express = require('express'); 
const app = express(); 
const mongoose = require('mongoose');

var dbUrl = 'mongodb://geanina:password1@ds155747.mlab.com:55747/shopping-list'; 

mongoose.connect(dbUrl , { useNewUrlParser: true },  (err) => { 
    console.log('data base connected',err);
 },
 { useUnifiedTopology: true }
 )

app.get('/',(req, res)=> {
    res.send('Hello you sexy creature!')
})


app.listen(4100, () => console.log('You app is listening on port 4100'));