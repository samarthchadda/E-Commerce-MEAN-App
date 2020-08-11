import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartModelServer } from '../models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartTotal:number;
  cartData:CartModelServer;

  constructor(private cartService:CartService,
              private orderService:OrderService,
              private routerBtn:Router,
              private spinner:NgxSpinnerService) { }

  ngOnInit(): void {

    this.cartService.cartDataObs.subscribe(data=>this.cartData = data);
    this.cartService.cartTotalObs.subscribe(total=>this.cartTotal = total);
    console.log("CART DATA :", this.cartData.data);
    localStorage.setItem('prods',JSON.stringify(this.cartData));

  }

  onCheckout()
  {
     this.spinner.show();
     
                  //this method requires userId
     this.cartService.checkOutFromCart(2);
  }

}
