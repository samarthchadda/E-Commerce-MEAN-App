import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';

//declaring JQuery variable
declare let $:any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit, AfterViewInit {

  id:number;
  product;
  thumbImages:any[]=[];

  @ViewChild('quantity') qtyInput:ElementRef;

  constructor(private prodService:ProductService,
              private cartService:CartService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe((newParams:Params)=>{
      this.id = newParams['id'];
      console.log("PRODUCT ID : ", this.id);
      this.prodService.getSingleProd(this.id).subscribe(prod=>{
        this.product = prod;  
        console.log("SINGLE PRODUCT : ", this.product);

        if(prod[0].images != null)
        {
          this.thumbImages = prod[0].images.split(';');
          console.log("THUMB IMAGES : ", this.thumbImages);
        }
      })
    })

  }

  ngAfterViewInit()
  {
          // Product Main img Slick
      $('#product-main-img').slick({
        infinite: true,
        speed: 300,
        dots: false,
        arrows: true,
        fade: true,
        asNavFor: '#product-imgs',
      });

      // Product imgs Slick
      $('#product-imgs').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        centerMode: true,
        focusOnSelect: true,
        centerPadding: 0,
        vertical: true,
        asNavFor: '#product-main-img',
        responsive: [{
            breakpoint: 991,
            settings: {
              vertical: false,
              arrows: false,
              dots: true,
            }
          },
        ]
      });

      // Product img zoom
      var zoomMainProduct = document.getElementById('product-main-img');
      if (zoomMainProduct) {
        $('#product-main-img .product-preview').zoom();
      }

  }

  increase()
  {
    let value = parseInt(this.qtyInput.nativeElement.value);

    if(this.product[0].quantity >= 1){
      value++;
      if(value>this.product[0].quantity){
        value = this.product[0].quantity;
      }
    }else{
      return;
    }

    this.qtyInput.nativeElement.value = value.toString();

  }

  decrease()
  {
    let value = parseInt(this.qtyInput.nativeElement.value);

    if(this.product[0].quantity > 0){
      value--;
      if(value<=1){
        value = 1;
      }
    }else{
      return;
    }

    this.qtyInput.nativeElement.value = value.toString();

  }

  addToCart(id:number)
  {
    this.cartService.addProdToCart(id,+this.qtyInput.nativeElement.value);
  }


}
