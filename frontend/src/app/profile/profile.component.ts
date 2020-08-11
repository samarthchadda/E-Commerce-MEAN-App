import { Component, OnInit } from '@angular/core';
import { UserService, ResponseModel } from '../services/user.service';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { map} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  myUser:any;
  
  constructor(private authService:SocialAuthService,
              private userService:UserService,
              private routerBtn:Router) { }

  ngOnInit(): void {

    this.userService.userDataObs.pipe(map(user=>{
        if(user instanceof SocialUser)     // means from Google login
        {
          return {
            email:'test@test.com',
            ...user
          }
        }
        else{
          return user;
        }
    })).subscribe((data:ResponseModel | SocialUser)=>{
        this.myUser = data;
    });

  }

  logout()
  {
    this.userService.logout();
  }

}
