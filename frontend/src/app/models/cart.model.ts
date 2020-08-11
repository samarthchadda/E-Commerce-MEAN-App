import { ProductModelServer } from './product.model';

// this interface is for the server only
export interface CartModelServer
{
    total:number;
    data:[{
        product:ProductModelServer,
        numInCart: number                      //no. of items in cart
    }];

}

// this interface is for the server only
export interface CartModelPublic
{
    total:number; 
    prodData:[{
        id:number,
        incart:number
    }];
}


