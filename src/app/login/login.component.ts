import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import { LoginService } from '../sharedModule/service/login.service';
import {
  AuthService,
  GoogleLoginProvider
} from 'angular-6-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;                    // {1}
  private formSubmitAttempt: boolean; // {2}

  constructor(
    private fb: FormBuilder,         // {3}
    private loginService: LoginService ,// {4}
    private router: Router,
    private flashMessage:FlashMessagesService,
    private socialAuthService:AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({     // {5}
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.controls.email.value);
      this.loginService.login(this.form.value).subscribe((data)=>{
        var flashMessage=this.flashMessage;
        if(data.success){
          let image;
          this.loginService.storeUserData(data.token, data.user,image);
          this.flashMessage.show('You are now logged in', {
            cssClass: 'alert-success',
            timeout: 1000});
            this.loginService.getName();
           this.router.navigate(['/books']);

      } else{
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 1000});
        this.router.navigate(['/login']);
      }
      // {7}
    } );
    this.formSubmitAttempt = true;             // {8}
  }
}
}
