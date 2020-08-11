import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products:ProductResponseModel[] = [];

  private serveUrl = environment.SERVER_URL;

  constructor(private http:HttpClient) { }

  getSingleOrder(orderId:Number)
  {
                                                                                    //Now ,we will use then() instead of subscribe()
    return this.http.get(this.serveUrl+'/orders/'+orderId);
  }
} 


interface ProductResponseModel
{
  id:number;
  name:string;
  description:string;
  price:number;
  qtyOrdered:number;
  image:string;
}