import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
import { CartModelPublic, CartModelServer } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { ProductModelServer } from '../models/product.model';
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private serveUrl = environment.SERVER_URL;

  //Data variable to store cart information on client's local storage
  private cartDataClient:CartModelPublic = {
    total:0,  //initial value
    prodData:[{
      incart:0,
      id:0
    }]
  };

  //Data variable to store cart information (on frontend angular)
  private cartDataServer:CartModelServer = {
    total:0,
    data:[{
      numInCart:0,
      product:undefined  //initially
    }]
  }

  //Observables for the components to subscribe
                                      //initial value
  cartTotalObs = new BehaviorSubject<number>(0);
  cartDataObs = new BehaviorSubject<CartModelServer>(this.cartDataServer);

  constructor(private http:HttpClient,
              private prodService:ProductService, 
              private orderService:OrderService,
              private routerBtn:Router,
              private spinner: NgxSpinnerService,
              private toast: ToastrService)
   {
      this.cartTotalObs.next(this.cartDataServer.total);
      this.cartDataObs.next(this.cartDataServer);

      //getting information from local storage(if any)
      let info:CartModelPublic = JSON.parse(localStorage.getItem('cart'));

      if(info!==null && info!==undefined && info.prodData[0].incart!==0)
      { 
        this.cartDataClient = info;

        //looping through each entry and put it in cartDataServer object
        this.cartDataClient.prodData.forEach(p=>{
          this.prodService.getSingleProd(p.id).subscribe((prodInfo:ProductModelServer)=>{
            console.log("Product INFO (In constructor): ", prodInfo[0]);
            if(this.cartDataServer.data[0].numInCart==0)  //means dataserver cart is empty
            {
              this.cartDataServer.data[0].numInCart = p.incart;
              this.cartDataServer.data[0].product = prodInfo[0];

              this.calculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
            }else{
              //CartDataServer already has some entry in it
              this.cartDataServer.data.push({
                numInCart:p.incart,
                product:prodInfo[0]
              });
              
              this.calculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart',JSON.stringify(this.cartDataClient));

            }

            this.cartDataObs.next({...this.cartDataServer});

          });
        });

      }

   }


   addProdToCart(prodId:number, qty?:number)
   {
     this.prodService.getSingleProd(prodId).subscribe(prod=>{

      console.log("Product ID (Add to cart ) : ", prod[0].id);
        //if the cart is empty
        if(this.cartDataServer.data[0].product === undefined)
        {
          this.cartDataServer.data[0].product = prod[0];
          console.log("Data Server : ", this.cartDataServer.data);
          
          console.log("ID in Data Server : ", this.cartDataServer.data[0].product.id);
          this.cartDataServer.data[0].numInCart = qty!==undefined?qty:1;   //using 1 as default quantity
          
          this.calculateTotal();
          this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
          this.cartDataClient.prodData[0].id = prod[0].id;
          this.cartDataClient.total = this.cartDataServer.total;

          console.log("Cart Data Client : ", this.cartDataClient);
          //updating localStorage
          localStorage.setItem('cart',JSON.stringify(this.cartDataClient));
          this.cartDataObs.next({...this.cartDataServer});   //emitting copy of cartDataServer

          //TOASTER MESSAGE
                              //message,                        title,           override
          this.toast.success(`${prod[0].name} Added to the Cart.`, "Product Added", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
                    
        }
        else     //if cart has some items
        {   
          //finding index of the product in the cart
          // let index = this.cartDataServer.data.findIndex(p=>p.product.id == prod[0].id);  //-1 or positive value
          // this.cartDataServer.data.forEach(p=>{
          //   console.log("Inside FOREACH1 : ", p.product[0].id);
          //   console.log("Inside FOREACH2 : ", prod[0].id);
            
          //   // if( p.product[0].id ==  prod[0].id )
          //   // {
          //   //   index = 1
          //   //   console.log("Index : ",index);
          //   // }
          // });

          // let index  =  this.cartDataServer.data[0].product.id ==  prod[0].id ? prod[0].id : -1;

          let index  =  this.cartDataServer.data.findIndex(p=>p.product.id === prod[0].id);

          console.log("Index : ",index);

            //if new item is already present in the cart(above 'index' has positive value)
            if(index !== -1)
            {
              if(qty!==undefined && qty<=prod[0].quantity)
              {
                this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod[0].quantity ? qty : prod[0].quantity;

              }
              else{
                console.log("Num In CART :", this.cartDataServer.data[index].numInCart);
                console.log("Product Quantity : ",prod[0].quantity);
                this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod[0].quantity ? ++this.cartDataServer.data[index].numInCart : prod[0].quantity;

              }

              console.log("Card Data CLIENT: ", this.cartDataClient);
              this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;

              this.toast.info(`${prod[0].name} Quantity Updated in the Cart.`, "Product Updated", {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              });

              this.calculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;   
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                     
            }
            else   //if item is not in cart
            {
              this.cartDataServer.data.push({
                    numInCart:1,
                    product:prod[0]
              });

              this.cartDataClient.prodData.push({
                incart:1,
                id:prod[0].id
              }); 


              this.toast.success(`${prod[0].name} Added to the Cart.`, "Product Added", {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              });


              this.calculateTotal();
              this.cartDataClient.total = this.cartDataServer.total; 
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

              this.cartDataObs.next({...this.cartDataServer});

            }        
                   
        }

     });         

   }    

   updateCartItem(index:number, increase:boolean)
   {
     let data = this.cartDataServer.data[index];

     if(increase)
     {
        data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
        this.cartDataClient.prodData[index].incart = data.numInCart;

        this.calculateTotal();

        this.cartDataClient.total = this.cartDataServer.total; 
        this.cartDataObs.next({...this.cartDataServer});
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        
      

     }else{
        data.numInCart--;

        if(data.numInCart<1)
        {
          //TODO delete the product from CART , and then emitting new object
          this.deleteProdFromCart(index);
          this.cartDataObs.next({...this.cartDataServer});
          
        }else{
          this.cartDataObs.next({...this.cartDataServer});
          this.cartDataClient.prodData[index].incart = data.numInCart;

          this.calculateTotal();
          this.cartDataClient.total = this.cartDataServer.total; 
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }

    }

  }

  deleteProdFromCart(index:number)
  {
    if(window.confirm('Are you sure you want to remove the item?'))
    {
      this.cartDataServer.data.splice(index , 1);
                        //splice() method removes entry matching specified index
      
      this.cartDataClient.prodData.splice(index,1);
      
      //calculate total amount
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total; 
     
      if(this.cartDataClient.total==0)
     {
        //resetting everthing
        this.cartDataClient = {
          total:0,  
          prodData:[{
            incart:0,
            id:0
          }]
        };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

     }
     else
     {
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
     }

     if(this.cartDataServer.total==0)
     {
       this.cartDataServer =  {
        total:0,
        data:[{
          numInCart:0,
          product:undefined  
        }]
      };

      this.cartDataObs.next({...this.cartDataServer});

     }
     else
     {
      this.cartDataObs.next({...this.cartDataServer});
     }


    }
    else{
      //if the user clicks the cancel button
      return;
    }
  }

  private calculateTotal()
  {
    let total = 0;
    this.cartDataServer.data.forEach(p=>{

      console.log("Products in Func : ", p);
      const {numInCart} = p;
      const price =p.product.price;
     
      console.log("Price : ",p.product.price);
      total+=numInCart*price;

    });

    this.cartDataServer.total = total;
    this.cartTotalObs.next(this.cartDataServer.total);
  }

  checkOutFromCart(userId:number)
  {
    console.log("Inside Check out from cart");
      this.http.post(this.serveUrl+'/orders/payment',null).subscribe((res:{success:boolean})=>{
        if(res.success)
        {
          this.resetServerData();
          this.http.post(this.serveUrl+'/orders/new',{
            userId:userId,
            products: this.cartDataClient.prodData
          }).subscribe((data:OrderResponse)=>{

              console.log("DATA(checkOutFromCart):", data);
              console.log("DATA(checkOutFromCart) OrderID:", data.order_id[0].insertId);
              const orderID = +data.order_id[0].insertId;
              
            this.orderService.getSingleOrder(orderID).subscribe(prods=>{
              console.log("DATA(checkOutFromCart) prods:", prods);
              
              if(data.success)
              {
                const navigationExtras:NavigationExtras = {
                  state:{
                    message:data.message,
                    products:prods,
                    order_id:data.order_id[0].insertId,
                    total:this.cartDataClient.total
                  }
                };

                //TODO hide spinner
                this.spinner.hide();

                this.routerBtn.navigate(['/thankyou',orderID],navigationExtras).then(p=>{
                  this.cartDataClient={
                    total:0,  
                    prodData:[{
                      incart:0,
                      id:0
                    }]
                  };
                  this.cartTotalObs.next(0);
                  localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

                });
              }   
            });
      
          })
        }else{
          this.spinner.hide();
          this.routerBtn.navigateByUrl('/checkout').then();

          this.toast.error(`Failed to book the Order`, "Order Status", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

        }
      });
  }

  private resetServerData()
  {
    this.cartDataServer = {
      total:0,
      data:[{
        numInCart:0,
        product:undefined  
      }] 
    };

    this.cartDataObs.next({...this.cartDataServer});

  }


  CalculateSubTotal(index): number {
    //this fujnction is for finding TOTAL for a particular porduct
    let subTotal = 0;
  
    let p = this.cartDataServer.data[index];
    
    subTotal = p.product.price * p.numInCart;
  
    return subTotal;
  }
  

}


interface OrderResponse
{
    order_id:number;
    success:boolean;
    message:string;
    products:[{
      id:string,
      numIncart:string
    }];
}
