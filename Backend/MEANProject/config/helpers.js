//In this file , we will be connecting with our database
const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database : 'mega_shop',
    password : 'samarthmanu123'
})

//exporting the pool
module.exports = pool.promise();


