import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-admin-candidate-detail',
  templateUrl: './admin-candidate-detail.component.html',
  styleUrls: ['./admin-candidate-detail.component.css']
})
export class AdminCandidateDetailComponent implements OnInit {

  id;user_id;
  first_name;last_name;description;companyname;degreename;
  interest_area;why_work;availability_day;
  countries;history;education;
  experimented;languages;current_currency;current_salary;image_src;
  imgPath;nationality;contact_number;
  credentials: any = {};
  admin_log;
  constructor(private http: HttpClient,private el: ElementRef,private route: ActivatedRoute,private authenticationService: UserService,private router: Router)
  {

    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });


  }
  currentUser: User;
  info=[];
  approve;verify;is_verify;information;refeered;
  work_history;education_history;
  date_sort_desc = function (date1, date2)
  {
    if (date1.enddate > date2.enddate) return -1;
    if (date1.enddate < date2.enddate) return 1;
    return 0;
  };

  education_sort_desc = function (year1, year2)
  {
    if (year1.eduyear > year2.eduyear) return -1;
    if (year1.eduyear < year2.eduyear) return 1;
    return 0;
  };

  commercial;
  roles;
  platforms;
  email;
  response;
  referred_name;
  referred_link;
  detail_link;
  commercial_skills;
  formal_skills;
  ngOnInit()
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
    this.credentials.user_id = this.user_id;

    this.response = "";
    this.referred_link = "";
    this.referred_name = "";
    this.error = "";


    if(this.user_id && this.admin_log && this.currentUser)
    {
      if(this.admin_log.is_admin == 1)
      {
        this.authenticationService.getById(this.user_id)
          .subscribe(
            data => {
              this.info.push(data);
              this.approve = data._creator.is_approved;
              this.verify =data._creator.is_verify;
              this.work_history = data.work_history;
              this.work_history.sort(this.date_sort_desc);
              this.education_history = data.education_history;
              this.education_history.sort(this.education_sort_desc);
              this.countries = data.locations;
              this.countries.sort();
              if(this.countries.indexOf("remote") > -1){
                this.countries[0] = 'remote';
                this.countries = this.filter_array(this.countries);
              }
              this.interest_area =data.interest_area;
              this.interest_area.sort();
              this.roles  = data.roles;
              this.roles.sort();
              this.commercial = data.commercial_platform;
              if(this.commercial && this.commercial.length>0){
                this.commercial.sort(function(a, b){
                  if(a.platform_name < b.platform_name) { return -1; }
                  if(a.platform_name > b.platform_name) { return 1; }
                  return 0;
                })
              }
              this.experimented = data.experimented_platform;
              if(this.experimented && this.experimented.length>0){
                this.experimented.sort(function(a, b){
                  if(a.name < b.name) { return -1; }
                  if(a.name > b.name) { return 1; }
                  return 0;
                })
              }

              this.languages= data.programming_languages;
              if(this.languages && this.languages.length>0){
                this.languages.sort(function(a, b){
                  if(a.language < b.language) { return -1; }
                  if(a.language > b.language) { return 1; }
                  return 0;
                })
              }

              this.platforms=data.platforms;
              if(this.platforms && this.platforms.length>0){
                this.platforms.sort(function(a, b){
                  if(a.platform_name < b.platform_name) { return -1; }
                  if(a.platform_name > b.platform_name) { return 1; }
                  return 0;
                })
              }

              if(data._creator.candidate && data._creator.candidate.blockchain && data._creator.candidate.blockchain.commercial_skills && data._creator.candidate.blockchain.commercial_skills.length > 0)
              {
                this.commercial_skills = data._creator.candidate.blockchain.commercial_skills;
                this.commercial_skills.sort(function(a, b){
                  if(a.skill < b.skill) { return -1; }
                  if(a.skill > b.skill) { return 1; }
                  return 0;
                })
              }

              if(data._creator.candidate && data._creator.candidate.blockchain && data._creator.candidate.blockchain.formal_skills && data._creator.candidate.blockchain.formal_skills.length > 0)
              {
                this.formal_skills = data._creator.candidate.blockchain.formal_skills;
                this.formal_skills.sort(function(a, b){
                  if(a.skill < b.skill) { return -1; }
                  if(a.skill > b.skill) { return 1; }
                  return 0;
                })
              }
              if(data.image != null )
              {

                this.imgPath =  data.image;

              }

              if(this.approve === 1)
              {
                this.is_approved = "Aprroved";
              }

              else
              {
                this.is_approved = "";
              }

              if(data._creator.referred_email)
              {
                this.authenticationService.getReferenceDetail(data._creator.referred_email)
                  .subscribe(
                    refData => {

                      if(refData.candidateDoc){
                        if(refData.candidateDoc.first_name && refData.candidateDoc.last_name)
                          this.referred_name = refData.candidateDoc.first_name + " " + refData.candidateDoc.last_name;
                        else
                          this.referred_name = refData.candidateDoc._id ;


                        this.detail_link = '/admin-candidate-detail';
                        this.referred_link = refData.candidateDoc._creator;
                      }
                      else if(refData.companyDoc){
                        if(refData.companyDoc.first_name && refData.companyDoc.last_name)
                          this.referred_name = refData.companyDoc.first_name + " " + refData.companyDoc.last_name;
                        else
                          this.referred_name = refData.companyDoc._id ;

                        this.detail_link = '/admin-company-detail';
                        this.referred_link = refData.companyDoc._creator;
                      }
                      else
                      {
                        this.referred_name = refData.refDoc.email;
                      }

                          },
                    error => {
                      if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
                      {
                        this.error = error['error']['message'];
                      }
                      else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
                      {
                        this.error = error['error']['message'];
                      }
                      else
                      {
                        this.error = error['error']['message'];
                      }

                    }
                  );
                /*this.authenticationService.getById(data._creator.refered_id)
                  .subscribe(
                    data => {

                      if(data!='')
                      {
                        this.first_name = data.first_name;
                        this.last_name =data.last_name;

                      }
                      else
                      {
                        this.refeered="null";
                      }
                    });*/



              }

            },

            error =>
            {
              if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
                this.router.navigate(['/not_found']);
              }

            });
      }
      else
      {
        this.router.navigate(['/not_found']);

      }
    }
    else
    {
      this.router.navigate(['/not_found']);

    }
  }

  is_approve;is_approved;
  error;
  approveClick(event , approveForm: NgForm)
  {
    this.error = '';
    if(event.srcElement.innerHTML ==='Active' )
    {
      this.is_approve = 1;
    }
    else if(event.srcElement.innerHTML ==='Inactive')
    {
      this.is_approve =0;
    }

    this.authenticationService.aprrove_user(approveForm.value.id ,this.is_approve )
      .subscribe(
        data =>
        {

          if(data.success === true)
          {

            if(event.srcElement.innerHTML ==='Active' )
            {
              event.srcElement.innerHTML="Inactive";
              this.is_approved = "Aprroved";
            }
            else if(event.srcElement.innerHTML ==='Inactive')
            {
              event.srcElement.innerHTML="Active";
              this.is_approved = "";
            }
          }
          else if(data.is_approved ===0)
          {
            if(event.srcElement.innerHTML ==='Active' )
            {
              event.srcElement.innerHTML="Inactive";
              this.is_approved = "Aprroved";
            }
            else if(event.srcElement.innerHTML ==='Inactive')
            {
              event.srcElement.innerHTML="Active";
              this.is_approved = "";
            }
          }

        },
        error =>
        {
          if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            this.error = error['error']['message'];
          }
          if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false)
          {
            this.error = error['error']['message'];
          }
          else {
            this.error = "Something getting wrong";
          }

        });
  }

  filter_array(arr)
  {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }


}