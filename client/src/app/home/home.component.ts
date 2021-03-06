import {AfterViewInit, Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../Model/user';
import { Title, Meta } from '@angular/platform-browser';
import {NgForm} from '@angular/forms';
import {isPlatformBrowser} from "@angular/common";

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  credentials: any = {};
  button_status = '';
  currentUser: User;
  log_error; log_success;
  data;result;
  constructor( private route: ActivatedRoute,
               private router: Router,
               private authenticationService: UserService,private titleService: Title,private newMeta: Meta,
               @Inject(PLATFORM_ID) private platformId: Object) {
    this.titleService.setTitle('Learn and work on blockchain and cryptocurrency projects, freelance and find jobs for developers');
    this.route.queryParams.subscribe(params => {
      let ref_code = params['code'];
      if(ref_code) {
        localStorage.setItem('ref_code', ref_code);
      }
    });
  }
  ngAfterViewInit(): void
  {
    if (isPlatformBrowser(this.platformId)) {
      $(document).ready(function(){
        $('.customer-logos').slick({
          slidesToShow: 6,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 1500,
          arrows: false,
          dots: false,
          pauseOnHover: false,
          responsive: [{
            breakpoint: 992,
            settings: {
              slidesToShow: 4
            }
          }, {
            breakpoint: 768,
            settings: {
              slidesToShow: 3
            }
          }, {
            breakpoint: 520,
            settings: {
              slidesToShow: 1
            }
          }]
        });
      });
    }
    window.scrollTo(0, 0);
  }
  ngOnInit()
  {
    this.newMeta.updateTag({ name: 'description', content: 'Work and jobs for blockchain, cryptocurrency and DLT. Work for freelancers, volunteers, developers, CTOs and more with or without blockchain experience.' });
    this.newMeta.updateTag({ name: 'keywords', content: 'Jobs work blockchain technology, Developers freelance cryptocurrency, Hiring projects companies' });
    this.newMeta.updateTag({ name: 'title', content: 'Learn and work on blockchain and cryptocurrency projects, freelance and find jobs for developers' });
    if (isPlatformBrowser(this.platformId)) {
      $('#text').html($('.active > .carousel-caption').html());
      $('.slide').on('slid.bs.carousel', function () {
        $('#text').html($('.active > .carousel-caption').html());
      });
    }
  }

  internalRoute(page,dst){
    //this.sectionScroll=dst;
    this.router.navigate([page], {fragment: dst});
  }

  subscribe_modal_show(subscribeForm: NgForm) {
    this.button_status="submit";
    if (isPlatformBrowser(this.platformId)) $("#subscribeModal").modal("show");
  }

  subscribe(subForm: NgForm) {
    this.button_status="submit";
    this.log_success = '';
    this.log_error = '';
    if(this.credentials.first_name && this.credentials.last_name && this.credentials.email && this.credentials.notice){
      this.authenticationService.add_to_subscribe_list(this.credentials.first_name,this.credentials.last_name,this.credentials.email)
      .subscribe(
        data => {
          this.log_success = 'Successfully added';
        },
        error => {
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log_error = error['error']['message'];
          }
          else if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
            this.log_error = error['error']['message'];
          }
          else {
            this.log_error = 'Something went wrong';
          }
        }
      );
    }
  }

}
