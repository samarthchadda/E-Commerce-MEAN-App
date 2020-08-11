import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  auth = false;
  private SERVER_URL = environment.SERVER_URL;
  private user;
  users:any[] = [];

  authStateObs = new BehaviorSubject<boolean>(this.auth);
  userDataObs = new BehaviorSubject<SocialUser | ResponseModel>(null);
  

  constructor(private authService:SocialAuthService,
              private httpClient:HttpClient) 
  {
    authService.authState.subscribe((user:SocialUser)=>{
      if(user!==null)
      {
        this.auth = true;
        this.authStateObs.next(this.auth);
        this.userDataObs.next(user);
      }
    });
  }

  //login user with email and password
  loginUser(email:string, password:string)
  {
    // this.httpClient.post(this.SERVER_URL+'/auth/login',{email,password})
    //                 .subscribe((data:ResponseModel)=>{
    //                   this.auth = data.auth;
    //                   this.authStateObs.next(this.auth);
    //                   this.userDataObs.next(data);
    //                 });

      this.httpClient.get(this.SERVER_URL+'/auth/login').subscribe(res=>{
        // console.log("USERS (IN ANGULAR) : ", res["users"]);
        this.users = res["users"];
        console.log("USers Array : ", this.users);

        let loggedIn = false;

        this.users.forEach(u=>{
          console.log(u.username);

            //compare with username or email
          if(u.username==email && u.password==password)
          {
            this.auth = true;
            this.authStateObs.next(this.auth);
            this.userDataObs.next(u);
            loggedIn = true;
            return;
          }
        
        })
        if(!loggedIn)
        {
          alert("Incorrect USername Or Password");
        }
  
      });
  }

  //google authentication
  googleLogin()
  {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  //logout functionality (it will logout the user from both GOOGLE and local database account)
  logout()
  {
    this.authService.signOut();
    this.auth = false;
    this.authStateObs.next(this.auth);
  }
}

export interface ResponseModel
{
  token:string;
  auth:boolean;
  email:string;
  username:string;
  fname:string;
  lname:string;
  photoUrl:string;
  userId:number;
}
