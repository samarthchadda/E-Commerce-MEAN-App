import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email:string;
  password:string;

  constructor(private authService:SocialAuthService,
              private routerBtn:Router,
              private userService:UserService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.authStateObs.subscribe(authState=>{
      if(authState)
      {
        this.routerBtn.navigateByUrl(this.route.snapshot.queryParams['returnUrl'] || '/profile');
      }
      else{
        this.routerBtn.navigateByUrl('/login');
      }
    })
  }

  login(form:NgForm)
  {
    const email = this.email;
    const password = this.password;
    if(form.invalid)
    {
      return;      
    }

    form.reset();
    this.userService.loginUser(email,password);
  }

  signInWithGoogle()
  {
    this.userService.googleLogin();
  }

}
