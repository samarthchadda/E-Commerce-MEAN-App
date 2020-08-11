const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');


//using the CORS package for the cross-communication
const cors = require('cors');


const app = express();

//import routes
const usersRouter = require('./routes/users');
const productRoutes = require('./routes/product');
const ordersRoutes = require('./routes/orders');
const authRouter = require('./routes/auth');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
    origin: "*",
    methods : ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders : 'Content-Type, Authorization, Origin, X-Requested-With, Accept'

}));

//use Routes
app.use('/api/users', usersRouter);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRoutes);



app.use((req, res, next)=>{
    console.log("In the Middleware");
    next();

})

app.use((req, res, next)=>{
    res.send('<h1>Inside another Middleware');
})

app.listen(3000);


