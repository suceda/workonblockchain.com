import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { DataService } from '../../data.service';
declare var $:any;

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.css']
})
export class CandidateDetailComponent implements OnInit, AfterViewInit   {
  id;
  user_id;
  first_name;
  last_name;
  description;
  companyname;
  degreename;
  interest_area;
  why_work;
  availability_day;
  countries;
  history;
  education;
  experimented;
  languages;
  current_currency;
  current_salary;
  image_src;
  imgPath;
  nationality;
  contact_number;
  platforms;
  github;
  stack;
  roles;
  expected_salary;
  email;
  visaRequiredArray= [];
  noVisaArray = [];
  currency = ["£ GBP" ,"€ EUR" , "$ USD"];
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;

  ckeConfig: any;
  @ViewChild("myckeditor") ckeditor: any;

  constructor(private dataservice: DataService , private route: ActivatedRoute,private authenticationService: UserService,private router: Router)
  {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });
  }
  company_reply; currentUser: any;
  credentials: any = {};
  job_type = ["Part time", "Full time"];
  company_name;
  interview_location = '';
  interview_time = '';
  invalidMsg;

  date_sort_desc = function (date1, date2)
  {
    // DESCENDING order.
    if (date1.enddate > date2.enddate) return -1;
    if (date1.enddate < date2.enddate) return 1;
    return 0;
  };

  education_sort_desc = function (year1, year2)
  {
    // DESCENDING order.
    if (year1.eduyear > year2.eduyear) return -1;
    if (year1.eduyear < year2.eduyear) return 1;
    return 0;
  };

  cand_data=[];
  commercial;
  commercial_skills;
  formal_skills;
  message;
  selectedValueArray=[];

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }
  ngOnInit()
  {
    this.invalidMsg = '';
    this.selectedValueArray=[];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    localStorage.removeItem('previousUrl');
    if(this.currentUser && this.user_id && this.currentUser.type === 'company') {
      this.authenticationService.getLastJobDesc()
        .subscribe(
          data => {
            setTimeout(() => {
              $('.selectpicker').selectpicker('refresh');
            }, 900);
            if(data && data['message']) {
              let job_offer = data['message'].job_offer;
              this.credentials.job_title = job_offer.title;
              this.credentials.salary = job_offer.salary;
              this.credentials.currency = job_offer.salary_currency;
              this.credentials.location = job_offer.location;
              this.credentials.job_type = job_offer.type;
              this.credentials.job_desc = job_offer.description;
            }

          },
          error => {
            if (error['message'] === 500 || error['message'] === 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if (error['message'] === 403) {
              this.router.navigate(['/not_found']);
            }
          }
        );

      this.ckeConfig = {
        allowedContent: false,
        extraPlugins: 'divarea',
        forcePasteAsPlainText: true,
        removePlugins: 'resize,elementspath',
        removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
      };
      setInterval(() => {
        this.job_offer_msg = '';
      }, 7000);
      this.company_reply = 0;
      this.credentials.user_id = this.user_id;



      this.authenticationService.candidate_detail(this.user_id)
        .subscribe(
          dataa => {
            if (dataa) {
              if(dataa['candidate'].work_history) {
                this.history = dataa['candidate'].work_history;
                this.history.sort(this.date_sort_desc);
              }

              if(dataa['candidate'].education_history) {
                this.education = dataa['candidate'].education_history;
                this.education.sort(this.education_sort_desc);
              }

              this.cand_data.push(dataa);
              this.first_name = dataa['initials'];
              if(dataa['candidate'].availability_day === '1 month') this.availability_day = '1 month notice period';
              else if(dataa['candidate'].availability_day === '2 months') this.availability_day = '2 months notice period';
              else if(dataa['candidate'].availability_day === '3 months') this.availability_day = '3 months notice period';
              else if(dataa['candidate'].availability_day === 'Longer than 3 months') this.availability_day = '3+ months notice period';
              else this.availability_day =dataa['candidate'].availability_day;
              if(dataa['candidate'].locations)
              {
                let citiesArray = [];
                let countriesArray = [];
                for (let country1 of dataa['candidate'].locations)
                {
                  let locObject : any = {}
                  if (country1['remote'] === true) {
                    this.selectedValueArray.push({name: 'Remote' , visa_needed : false});
                  }

                  if (country1['country']) {
                    locObject.name = country1['country'];
                    locObject.type = 'country';
                    if(country1['visa_needed'] === true) locObject.visa_needed = true;
                    else locObject.visa_needed = false;
                    countriesArray.push(locObject);
                    countriesArray.sort(function(a, b){
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    });
                  }
                  if (country1['city']) {
                    let city = country1['city'].city + ", " + country1['city'].country;
                    locObject.name = city;
                    locObject.type = 'city';
                    if(country1['visa_needed'] === true) locObject.visa_needed = true;
                    else locObject.visa_needed = false;
                    citiesArray.push(locObject);
                    citiesArray.sort(function(a, b){
                      if(a.name < b.name) { return -1; }
                      if(a.name > b.name) { return 1; }
                      return 0;
                    });
                  }
                }

                this.countries = citiesArray.concat(countriesArray);
                this.countries = this.countries.concat(this.selectedValueArray);
                if(this.countries.find((obj => obj.name === 'Remote'))) {
                  let remoteValue = this.countries.find((obj => obj.name === 'Remote'));
                  this.countries.splice(0, 0, remoteValue);
                  this.countries = this.filter_array(this.countries);
                }
                if(this.countries && this.countries.length > 0) {

                  for(let loc of this.countries) {
                    if(loc.visa_needed === true)
                      this.visaRequiredArray.push(loc);
                    if(loc.visa_needed === false)
                      this.noVisaArray.push(loc);
                  }
                }

              }

              this.interest_area =dataa['candidate'].interest_areas;
              this.interest_area.sort();
              this.roles  = dataa['candidate'].roles;
              this.roles.sort();


              this.languages= dataa['candidate'].programming_languages;
              if(this.languages && this.languages.length>0){
                this.languages.sort(function(a, b){
                  if(a.language < b.language) { return -1; }
                  if(a.language > b.language) { return 1; }
                  return 0;
                })
              }

              if(dataa['candidate'] && dataa['candidate'].blockchain) {
                if (dataa['candidate'].blockchain.commercial_skills) {
                  this.commercial_skills = dataa['candidate'].blockchain.commercial_skills;
                  this.commercial_skills.sort(function (a, b) {
                    if (a.skill < b.skill) {
                      return -1;
                    }
                    if (a.skill > b.skill) {
                      return 1;
                    }
                    return 0;
                  })
                }

                if (dataa['candidate'].blockchain.commercial_platforms) {
                  this.commercial = dataa['candidate'].blockchain.commercial_platforms;
                  if (this.commercial && this.commercial.length > 0) {
                    this.commercial.sort(function (a, b) {
                      if (a.platform_name < b.platform_name) {
                        return -1;
                      }
                      if (a.platform_name > b.platform_name) {
                        return 1;
                      }
                      return 0;
                    });
                  }
                }

                if (dataa['candidate'].blockchain.experimented_platforms) {
                  this.experimented = dataa['candidate'].blockchain.experimented_platforms;
                  if (this.experimented && this.experimented.length > 0) {
                    this.experimented.sort(function (a, b) {
                      if (a < b) {
                        return -1;
                      }
                      if (a > b) {
                        return 1;
                      }
                      return 0;
                    });
                  }
                }

                if(dataa['candidate'].blockchain.description_commercial_platforms) {
                  this.description_commercial_platforms = dataa['candidate'].blockchain.description_commercial_platforms;
                }

                if(dataa['candidate'].blockchain.description_experimented_platforms) {
                  this.description_experimented_platforms = dataa['candidate'].blockchain.description_experimented_platforms;
                }

                if(dataa['candidate'].blockchain.description_commercial_skills) {
                  this.description_commercial_skills = dataa['candidate'].blockchain.description_commercial_skills;
                }
              }

            }
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }

          });
      this.authenticationService.getCurrentCompany(this.currentUser.company_id)
        .subscribe(
          data => {
            this.company_name = data['company_name'];
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }

          });

    }

    else if(this.currentUser && this.user_id  && this.currentUser.type === 'candidate') {
      this.invalidMsg = "Please log in with an approved company account to view this profile";
    }
    else
    {
      const location = window.location.href.split('/');
      window.localStorage.setItem('previousUrl', location[3]);
      this.router.navigate(['/login']);

    }
  }

  date_of_joining;
  msg_tag;
  is_company_reply = 0;
  msg_body;
  job_offer_msg;
  job_offer_msg_success;
  full_name;
  job_description;
  job_title_log;
  location_log;
  salary_log;
  salary_currency_log;
  employment_log;
  job_desc_log;
  job_offer_log_erorr;

  send_job_offer(msgForm : NgForm) {
    this.job_title_log = '';
    this.location_log = '';
    this.salary_log = '';
    this.salary_currency_log = '';
    this.employment_log = '';
    this.job_desc_log = '';
    this.job_offer_log_erorr = '';

    if(!this.credentials.job_title){
      this.job_title_log = 'Please enter job title';
    }
    if(!this.credentials.location){
      this.location_log = 'Please enter location';
    }
    if(!this.credentials.salary){
      this.salary_log = 'Please enter salary';
    }
    if(!this.credentials.currency){
      this.salary_currency_log = 'Please select currency';
    }
    if(!this.credentials.job_type){
      this.employment_log = 'Please select employment type';
    }
    if(!this.credentials.job_desc){
      this.job_desc_log = 'Please enter job description';
    }

    this.full_name = this.first_name;
    if (this.credentials.job_title && this.credentials.location && this.credentials.currency && this.credentials.job_type && this.credentials.job_desc) {
      if (this.credentials.salary && Number(this.credentials.salary) && (Number(this.credentials.salary)) > 0 && this.credentials.salary % 1 === 0) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let job_offer : any = {};
        job_offer.title = this.credentials.job_title;
        job_offer.salary = this.credentials.salary;
        job_offer.salary_currency = this.credentials.currency;
        job_offer.type = this.credentials.job_type;
        job_offer.location = this.credentials.location;
        job_offer.description = this.credentials.job_desc;
        let new_offer : any = {};
        new_offer.job_offer = job_offer;
        this.authenticationService.send_message(this.credentials.user_id, 'job_offer',new_offer)
        .subscribe(
          data => {
            this.job_offer_msg_success = 'Message has been successfully sent';
            this.router.navigate(['/chat']);
          },
          error => {
            if (error['status'] === 400) {
              this.job_offer_log_erorr = 'You have already sent a job description to this candidate';
            }
            if(error['status'] === 500 || error['status'] === 401){
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }
            if(error['status'] === 404){
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }
          }
        );
      }
      else {
        //this.job_offer_msg = 'Salary should be a number';
        this.job_offer_msg = 'One or more fields need to be completed. Please scroll up to see which ones.';
      }
    }
    else {
      this.job_offer_msg = 'One or more fields need to be completed. Please scroll up to see which ones.';
    }
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
