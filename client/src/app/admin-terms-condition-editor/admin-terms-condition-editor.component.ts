import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../user.service';
import {NgForm} from '@angular/forms';
import {User} from '../Model/user';
import { DataService } from "../data.service";

@Component({
  selector: 'app-admin-terms-condition-editor',
  templateUrl: './admin-terms-condition-editor.component.html',
  styleUrls: ['./admin-terms-condition-editor.component.css']
})
export class AdminTermsConditionEditorComponent implements OnInit {

   currentUser: User;
    editor_content;
    editor_text;
    name = 'ng2-ckeditor';
    ckeConfig: any;
    mycontent: string;
    log: string = '';
    @ViewChild("myckeditor") ckeditor: any;
    page_title;
    page_name;
    admin_log;
    message;
    company_page_title;
    company_editor_content;
    company_page_name;
    
  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService,private dataservice: DataService) { 
    
  }

  ngOnInit() {
       this.dataservice.currentMessage.subscribe(message => this.message = message);
       this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '35rem',
    minHeight: '10rem',
    };
      
     this.company_page_name = 'Terms and Condition for company';
    this.page_name = 'Terms and Condition for candidate';
      
     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
      
       if(this.currentUser && this.admin_log )
        {
           if(this.admin_log.is_admin == 1)
           {
             this.authenticationService.get_page_content('Terms and Condition for candidate')
            .subscribe(
                data => {
                   if(data)
                   {
                       //console.log(data);
                        this.page_title = data[0].page_title;
                       this.editor_content = data[0].page_content;
                       console.log(this.editor_content);
                       
                   }
                 });
               this.authenticationService.get_page_content('Terms and Condition for company')
            .subscribe(
                data => {
                   if(data)
                   {
                      // console.log(data);
                        this.company_page_title = data[0].page_title;
                       this.company_editor_content = data[0].page_content;
                       console.log(this.editor_content);
                       
                   }
                 });
           }
           else
               this.router.navigate(['/not_found']);
        }
        else
        {
           this.router.navigate(['/not_found']);
          
        }
  }

   editor(editorForm: NgForm)
   {
        
       console.log(editorForm.value);
       this.editor_text = this.editor_content;  
       this.authenticationService.pages_content(editorForm.value)
       .subscribe(
       data => 
       {
           if(data.error)
           {
               this.dataservice.changeMessage("Something went wrong");
              
           }
           else
           {
                this.dataservice.changeMessage("Content Successfully Updated");
           }
       });
   }

   company_editor(companyeditor: NgForm)
   {
       this.company_page_name = 'Terms and Condition for company';
       console.log(companyeditor.value);
       this.authenticationService.pages_content(companyeditor.value)
       .subscribe(
       data => 
       {
           if(data.error)
           {
               this.dataservice.changeMessage("Something went wrong");
               
           }
           else
           {
               this.dataservice.changeMessage("Content Successfully Updated");
           }
       });
   }

}