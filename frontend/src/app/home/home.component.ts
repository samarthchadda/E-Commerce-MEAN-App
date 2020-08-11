import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { ProductModelServer, ServerResponse } from '../models/product.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products:ProductModelServer[] = [];

  constructor(private prodService:ProductService,
               private routerBtn:Router,
               private cartService:CartService) { }

  ngOnInit(): void {
    this.prodService.showMsg();

                    //giving limit of 3
    this.prodService.getAllProds(10).subscribe((prods:ServerResponse)=>{
     
      // console.log(prods);
      this.products = prods.products;
      console.log("PRODUCTS : ",this.products);

    })

  }

  selectProd(id:number)
  {
    this.routerBtn.navigate(['/product',id]);
  }

  AddToCart(id:number)
  {
    console.log("Product ID : ", id);
    this.cartService.addProdToCart(id);
  }

}
