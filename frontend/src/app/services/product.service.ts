import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProductModelServer } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  SERVER_URL = environment.SERVER_URL;

  constructor(private http:HttpClient,private routerBtn:Router) { }

  showMsg()
  {
    console.log("Service called");
  }

  // Fetching all products from the BACKEND server
  getAllProds(noOfResults:number=10)    //default value for this parameter is 10
  {
   return this.http.get(this.SERVER_URL+'/products',{
     params:{
       limit : noOfResults.toString()
     }
   });
  }

  //Fetching a single product
  getSingleProd(id:number)
  {
    return this.http.get<ProductModelServer>(this.SERVER_URL+'/products/'+id);

  }

  //Fteching products from one category
  getProdsByCategory(catName:string)
  {
    return this.http.get<ProductModelServer>(this.SERVER_URL+'/products/category/'+catName);
  }
}
