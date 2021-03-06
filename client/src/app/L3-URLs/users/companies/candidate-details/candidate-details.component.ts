import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../user.service' ;

@Component({
  selector: 'app-u-users-companies-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {
  currentUser;
  user_id;
  userDoc;
  anonimize = false;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
    this.route.params.subscribe(params => {
      this.user_id = params['user_id'];
    });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser && this.currentUser.type === 'company'){
      this.authenticationService.candidate_detail(this.user_id)
        .subscribe(data => {
            if (data) {
              if(data['initials']) this.anonimize = true;
              this.userDoc = data;
            }
            else this.router.navigate(['/not_found']);
          },
          error => {
            this.router.navigate(['/not_found']);
          }
        );
    }
    else this.router.navigate(['/not_found']);
  }

}
