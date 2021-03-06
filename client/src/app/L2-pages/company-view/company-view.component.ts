import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import { createLocationsListStrings,copyObject,makeImgCode,makeIconCode,getClass } from  '../../../services/object';
import { DatePipe } from '@angular/common';
import {NgForm} from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-p-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.css']
})
export class CompanyViewComponent implements OnInit {
  @Input() userDoc: object;
  @Input() viewBy: string; // admin, company

  companyMsgTitle;companyMsgBody;imgPath;referred_name;
  pricePlanLink = '/pricing';company_name;countries; selectedValueArray = [];
  error;is_approve;disabled=true;referred_link;detail_link;discount;
  company_phone;date_created;is_approved = '';addJobPageURL;

  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private router: Router,private authenticationService: UserService) { }

  ngOnInit() {
    this.addJobPageURL = '/users/company/jobs/new';
    this.referred_name = '';
    this.discount = '0%';
    if(this.userDoc['discount']) this.discount = this.userDoc['discount']+'%';
    if(this.userDoc['company_logo'] != null ) this.imgPath =  this.userDoc['company_logo'];

    if (this.userDoc['name']) {
      this.referred_name = this.userDoc['name'];
      this.referred_name = this.referred_name.charAt(0).toUpperCase()+''+this.referred_name.slice(1)
    }
    else if(this.userDoc['_creator'].referred_email) this.referred_name = this.userDoc['_creator'].referred_email;

    if(this.viewBy === 'admin'){
      this.addJobPageURL = '/admins/company/'+this.userDoc['_creator']._id+'/jobs/new';
      this.date_created = copyObject(this.userDoc['_creator'].created_date);
      this.date_created = this.datePipe.transform(this.date_created, 'dd-MMMM-yyyy');
      this.userDoc['_creator'].dissable_account_timestamp = this.datePipe.transform(this.userDoc['_creator'].dissable_account_timestamp, 'short');
      if(this.userDoc['user_type'] === 'company') this.detail_link = '/admins/company';
      if(this.userDoc['user_type'] === 'candidate') this.detail_link = '/admins/talent';

      if (this.userDoc['name']) this.referred_link = this.userDoc['user_id'];
      if(this.userDoc['_creator'].is_approved) this.is_approved = "Approved";
    }

    this.company_name = this.userDoc['first_name'].charAt(0).toUpperCase()+''+this.userDoc['first_name'].slice(1)+' '+this.userDoc['last_name'].charAt(0).toUpperCase()+''+this.userDoc['last_name'].slice(1)

    this.company_phone = '';
    let country_code;
    let contact_number = copyObject(this.userDoc['company_phone']);
    contact_number = contact_number.replace(/^00/, '+');
    contact_number = contact_number.split(" ");
    if(contact_number.length>1) {
      for (let i = 0; i < contact_number.length; i++) {
        if (i === 0) country_code = '('+contact_number[i]+')';
        else this.company_phone = this.company_phone+''+contact_number[i];
      }
      this.company_phone = country_code+' '+this.company_phone
    }
    else this.company_phone = contact_number[0];

    if(this.viewBy === 'company'){
      this.authenticationService.get_page_content('Company popup message')
      .subscribe(
        data => {
          if(data){
              this.companyMsgTitle = data['page_title'];
              this.companyMsgBody = data['page_content'];
          }
        }
      );
    }
  }

  getLocation(location) {
    this.selectedValueArray = [];
    for (let country1 of location) {
      let locObject : any = {};
      if (country1['remote'] === true) {
        this.selectedValueArray.push({name: 'Remote'});
      }
      if (country1['city']) {
        let city = country1['city'].city + ", " + country1['city'].country;
        locObject.name = city;
        locObject.type = 'city';
        this.selectedValueArray.push(locObject);
      }
    }
    this.countries = this.selectedValueArray;
    this.countries.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
    if(this.countries.find((obj => obj.name === 'Remote'))) {
      let remoteValue = this.countries.find((obj => obj.name === 'Remote'));
      this.countries.splice(0, 0, remoteValue);
      this.countries = this.filter_array(this.countries);
    }
    let newCountries = [];
    newCountries = createLocationsListStrings(this.countries);
    return newCountries;
  }

  filter_array(arr) {
    var hashTable = {};
    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);
      return (match ? false : hashTable[key] = true);
    });
  }

  createBlockchainLogos(commercial){
    let newCommercials = [];
    for(let commercials of commercial){
      let img;
      if(commercials.type === 'blockchain') {
        img = makeImgCode(commercials) + commercials.name+': ' +commercials.exp_year +' years';
      }
      if(commercials.type === 'language') {
        img = makeIconCode('fas fa-code') + commercials.name+': ' +commercials.exp_year +' years';
      }
      if(commercials.type === 'experience') {
        img = makeIconCode('fas fa-user-friends') + commercials.name+': ' +commercials.exp_year +' years';
      }
      newCommercials.push(img);
    }
    return newCommercials;
  }

  makeCurrencySalary(salary, currency){
    return (currency+' '+salary);
  }

  approveClick(event , approveForm: NgForm) {
    this.error = '';
    if(event.srcElement.innerText === 'Approve' ) this.is_approve = 1;
    else if(event.srcElement.innerText === 'Disapprove') this.is_approve = 0;

    this.authenticationService.aprrove_user(approveForm.value.id ,this.is_approve )
    .subscribe(
      data =>
      {
        if(data['success'] === true){
          if(event.srcElement.innerText ==='Approve' ) {
            event.srcElement.innerText="Disapprove";
            this.is_approved = "Approved";
          }
          else if(event.srcElement.innerText ==='Disapprove') {
            event.srcElement.innerText="Approve";
            this.is_approved = "";
          }
        }
        else if(data['is_approved'] === 0) {
          if(event.srcElement.innerText ==='Approve' ) {
            event.srcElement.innerText="Disapprove";
            this.is_approved = "Approved";
          }
          else if(event.srcElement.innerText ==='Disapprove') {
            event.srcElement.innerText="Approve";
            this.is_approved = "";
          }
        }
      },
      error =>
      {
        if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)  {
          this.error = error['error']['message'];
        }
        if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
          this.error = error['error']['message'];
        }
        else this.error = "Something went wrong";
      }
    );
  }

  getClassName(value){
    return getClass(value);
  }

  getIdForLink(user, jobId, companyId){
    if(user === 'company') return '/users/company/jobs/'+jobId;
    if(user === 'admin') return '/admins/company/'+companyId+'/jobs/'+jobId;
  }

}
