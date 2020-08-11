//importing the path core module ,( to handle path for views )
const path = require('path');

const express = require('express');

const router =  express.Router();  

const db = require('../config/helpers');
const { route } = require('./product');

//Get all Orders
router.get('/',(req, res , next)=>{    
    
    db.execute("SELECT o.id, p.title as name, p.description, p.price, u.username FROM orders_details as od JOIN orders as o on o.id=od.order_id JOIN products as p on p.id=od.product_id JOIN users as u on u.id=o.user_id")
        .then(orders=>{
            if(orders[0].length>0)
            {
                                    //also, sorted by the orderID(as it is the first column)
                res.status(200).json(orders[0].sort());
            }
            else{
                res.json({message:'No orders found'});
            }
        })
        .catch(err=>console.log(err));

});
        
//Get single order
router.get('/:id', (req, res, next)=>{
    const orderId = req.params.id;

    db.execute("SELECT o.id, p.title as name, p.description, p.price,od.quantity ,u.username FROM orders_details as od JOIN orders as o on o.id=od.order_id JOIN products as p on p.id=od.product_id JOIN users as u on u.id=o.user_id WHERE o.id=?",[orderId])
    .then(orders=>{
        if(orders[0].length>0)
        {
                                //also, sorted by the orderID(as it is the first column)
            res.status(200).json({
                count:orders[0].length,
                orders:orders[0].sort()});
        }
        else{
            res.json({message:'No orders found with given orderId'});
        }
    })
    .catch(err=>console.log(err));

})

//Place a new order
router.post('/new', (req, res, next)=>{

    let {userId, products} = req.body;     //we will pass the userID, and products array(containg object for each productID and quantity)

    // console.log(req.body);
    // console.log(userId,products);

                                    //isNAN --  true, if given argument is NOT a number
                                    //          false, if given argument is a number    
    if(userId!==null && userId>0 && !isNaN(userId))
    {
        //storing userId in 'orders' table
        // db.execute('INSERT INTO orders(user_id) VALUES(?)',[userId])
        //     .then(result=>{

        //     })
        //     .catch(err=>console.log(err));

        // db.execute('INSERT INTO orders_details(order_id,product_id,quantity) VALUES(?,?,?)',[119,3,1])
        // .then()
        // .catch();
                         
        // db.execute('update products set quantity = ? where id = ?',[54,2])
        // .then(successNum=>{

        //     }).catch(err=>console.log(err));

        db.execute('INSERT INTO orders(user_id) VALUES(?)',[userId])
        .then(newOrderId=>{
            console.log("NEW ORDER ID : ",newOrderId[0].insertId);
                if(newOrderId[0].insertId > 0)
                {
                    products.forEach( async (p) => {
                        
                        let dataQty;
                        await db.execute("SELECT quantity FROM products WHERE id=?",[p.id])
                                .then(result=>{
                                    
                                    dataQty = result[0][0].quantity;
                                    console.log("Quantity : ",dataQty);
                                })
                                .catch(err=>console.log(err));
                        // console.log("DATA QUANTITY : ", data.quantity);

                        let incart = p.incart;
                        console.log("INCART : ", incart);

                        //deduct the number of pieces ordered from quantity column in database
                        if(dataQty>0)
                        {
                            dataQty = dataQty - incart;
                            console.log("CHANGED DATAQTY : ", dataQty);


                            if(dataQty<0)
                            {
                                dataQty = 0;
                            }

                        }else{
                            dataQty = 0;
                           
                        }

                        // Insert 'orders_details' w.r.t newly generated ID
                        db.execute('INSERT INTO orders_details(order_id,product_id,quantity) VALUES(?,?,?)',[newOrderId[0].insertId,p.id,incart])
                            .then(newId=>{
                                console.log("INSERTING INTO ORDER DETAILS");
                                db.execute('update products set quantity = ? where id = ?',[dataQty,p.id])
                                .then(successNum=>{
                                    console.log("DATA UPDATED :", successNum);
                                    }).catch(err=>console.log(err));

                            }).catch(err=>console.log(err));

                    });
                }else{
                    res.json({message:'New order failed while adding order details', success:false});
                }

                res.json({
                    message:'Order successfully placed with new OrderID',
                    success : true,
                    order_id : newOrderId,
                    products:products
                }); 

            }).catch(err=>console.log(err));

    }else{
        res.json({message:'New Order Failed', success:false});
    }

})

// Fake payment gateway call
router.post('/payment', (req, res, next)=>{
    setTimeout(()=>{
        res.status(200).json({success:true});
    }, 3000)
})


module.exports = router; 



