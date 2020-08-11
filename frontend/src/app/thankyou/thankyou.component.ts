import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CartService } from '../services/cart.service';
import { CartModelServer } from '../models/cart.model';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  message:string;
  orderId:number;
  products;
  cartTotal:number;
  prodByOrder;
  
  newOrderId:number;

  cartData:CartModelServer;

  constructor(private routerBtn:Router,private orderService:OrderService, private route:ActivatedRoute,private cartService:CartService) 
  {
    const navigation = this.routerBtn.getCurrentNavigation();
    const state = navigation.extras.state as {
      message:string,
      products:ProductResponseModel[],
      order_id:number,
      total:number      
    };

    // // this.message = state.message;
    // // this.products = state.products;
    this.orderId = state.order_id;
    this.cartTotal = state.total;
    
    // // console.log("STATE:", state);    
    // console.log("ORDER ID:", this.orderId);
    
 
    // this.orderService.getSingleOrder(this.orderId).subscribe(prods=>{
    //   console.log(prods);
    //   this.prodByOrder = prods["orders"];
    //   console.log("PRODUCTS:", this.prodByOrder);
    //   // console.log("PRODUCTS orders:", this.prodByOrder.orders);
      
    // });
    
    
    
  }

  ngOnInit(): void {
    //   this.route.params.subscribe((newParams:Params)=>{
    //       this.newOrderId = newParams['orderID']

    //   })
    // console.log("NEW ORDER ID : ", this.newOrderId);

    this.orderService.getSingleOrder(this.orderId).subscribe(prods=>{
      console.log(prods);

      this.prodByOrder = prods["orders"];
      console.log("PRODUCTS(newOrder):", this.prodByOrder);
      // console.log("PRODUCTS orders:", this.prodByOrder.orders);
      
    });
    
    this.cartData = JSON.parse(localStorage.getItem('prods'));
    console.log("CART DATA(Thank You) : ", this.cartData.total);
  }

}


interface ProductResponseModel
{
  id:number;
  name:string;
  description:string;
  price:number;
  quantityOrdered:number;
  image:string;
}


