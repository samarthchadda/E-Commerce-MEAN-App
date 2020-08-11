const path = require('path');

const express = require('express');

//express router
const router =  express.Router();   

const db = require('../config/helpers');
const { json } = require('body-parser');

// Get all PRODUCTS
router.get('/',(req,res,next)=>{
    
    //set the current page number
    let page = (req.query.page !== undefined && req.query.page!==0) ? req.query.page : 1;
    //set the limits of items per page
    const limit = (req.query.limit !== undefined && req.query.limit!==0) ? req.query.limit : 10;  
    
    let startValue;
    let endValue;

    if(page>0)
    {
        startValue = (page*limit) - limit;   //0, 10 , 20, 30 etc
        endValue = page*limit;
    }else{
        startValue = 0;
        endValue = 10;
    }

    db.execute('SELECT c.title as category,p.title as name, p.price,p.description,p.quantity, p.image,p.id FROM products as p JOIN categories as c on c.id=p.cat_id ORDER BY p.id')
    .then(result=>{
        
        prods = result[0].slice(startValue,endValue);

        console.log("DATA prods : ",prods);

        res.status(200).json({
            count:prods.length,
            products:prods
        })

    }).catch(err=>console.log(err));

});

//Get single product
router.get('/:prodId',(req, res, next)=>{

    //fetching product id
    let productId = req.params.prodId;
    console.log("PRODUCT ID : ", productId);

    db.execute('SELECT c.title as category,p.title as name, p.price, p.description,p.quantity, p.image,p.images,p.id FROM products as p JOIN categories as c on p.cat_id=c.id WHERE p.id=?',[productId])
    .then(prod=>{
        
        if(prod[0].length!==0)
        {
            console.log("DATA prods(single data) : ",prod[0]);

            res.status(200).json(prod[0]);
        }else{
            res.json({message:'No Product Found'})
        }

    }).catch(err=>console.log(err));

});

//Get all products from one particular category
router.get('/category/:catName',(req,res,next)=>{
    
    //set the current page number
    let page = (req.query.page !== undefined && req.query.page!==0) ? req.query.page : 1;
    //set the limits of items per page
    const limit = (req.query.limit !== undefined && req.query.limit!==0) ? req.query.limit : 10;  
    
    let startValue;
    let endValue;

    if(page>0)
    {
        startValue = (page*limit) - limit;   //0, 10 , 20, 30 etc
        endValue = page*limit;
    }else{
        startValue = 0;
        endValue = 10;
    }

    //fetching category name from the URL
    const cat_title = req.params.catName;
    console.log("CATEGORY NAME : ", cat_title);

    db.execute(`SELECT c.title as category,p.title as name, p.price,p.description,p.quantity, p.image,p.id FROM products as p JOIN categories as c on p.cat_id=c.id WHERE c.title LIKE '%${cat_title}%'`)
    .then(result=>{
        prods = result[0].slice(startValue,endValue).sort();

        if(prods.length>0)
        {
            console.log("DATA prods : ",prods);

            res.status(200).json({
                count:prods.length,
                products:prods
            });
        }else{
            res.json({message:'No products found with given category'});
        }

    }).catch(err=>console.log(err));

})

module.exports = router;  //this router has routes that are registered above

