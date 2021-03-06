import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  hash;
  log;
  password;
  constructor(private route: ActivatedRoute, private http: HttpClient,
              private router: Router,
              private authenticationService: UserService,private dataservice: DataService) {


    this.route.queryParams.subscribe(params =>
    {
      this.hash = params['hash'];
    });

  }

  ngOnInit() {

  }
  reset_password_log;
  button_response;

  reset_password(f: NgForm)
  {
    this.reset_password_log = '';
    this.button_response = 'submit';
    if(!f.value.password) {
      this.reset_password_log = 'Please enter the new password.';
    }
    if(f.valid === true) {
      this.authenticationService.reset_password(this.hash, f.value)
        .subscribe(
          data => {
            this.dataservice.forgertMessage("Password updated successfully");
            this.router.navigate(['/login']);

          },
          error => {
            if (error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
            }
            else if (error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.log = error['error']['message'];
            }
            else if (error['status'] === 500) {
              this.log = "Something went wrong. Please check your link";
            }
            else {
              this.log = "Something went wrong";
            }

          });
    }

  }

}
