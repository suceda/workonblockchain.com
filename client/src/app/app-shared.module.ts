import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './pipe.safehtml';
import { RouterModule } from '@angular/router';
import { MatInputModule, MatSelectModule , MatAutocompleteModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ImageCropperModule} from 'ng2-img-cropper/index';
import { CKEditorModule } from 'ng2-ckeditor';
import { TextValueComponent } from './L0-components/forms-view/text/text.component';
import { DashboardComponent } from './L1-items/dashboard/dashboard.component';
import { DropdownSingleComponent } from './L0-components/forms-edit/dropdown-single/dropdown-single.component';
import { WizardsComponent } from './L0-components/navbars/wizards/wizards.component';
import { HtmlAreaComponent } from './L0-components/forms-edit/html-area/html-area.component';
import { TwitterShareComponent } from './L0-components/buttons/twitter-share/twitter-share.component';
import { SocialLoginComponent } from './L0-components/buttons/social-login/social-login.component';
import { OthersComponent } from './L0-components/buttons/normal/normal.component';
import { AlertsComponent } from './L0-components/alerts/alerts/alerts.component';
import { AutosuggestSelectedValueComponent } from './L0-components/forms-edit/badge/badge.component';
import { TextInputComponent } from './L0-components/forms-edit/text-input/text-input.component';
import { TextAreaComponent } from './L0-components/forms-edit/text-area/text-area.component';
import { RadioComponent } from './L0-components/forms-edit/radio/radio.component';
import { FirstNameComponent } from './L1-items/users/first-name/first-name.component';
import { WorkHistoryComponent } from './L1-items/candidate/work-history/work-history.component';
import { CandidateEditComponent } from './L2-pages/candidate-edit/candidate-edit.component';
import { CheckboxComponent } from './L0-components/forms-edit/checkbox/checkbox.component';
import { BioComponent } from './L1-items/candidate/bio/bio.component';
import { ContactNumberComponent } from './L1-items/users/contact-number/contact-number.component';
import { EmailAddressComponent } from './L1-items/users/email-address/email-address.component';
import { GithubUrlComponent } from './L1-items/candidate/github-url/github-url.component';
import { LastNameComponent } from './L1-items/users/last-name/last-name.component';
import { LinkedinUrlComponent } from './L1-items/candidate/linkedin-url/linkedin-url.component';
import { MediumUrlComponent } from './L1-items/candidate/medium-url/medium-url.component';
import { NationalityComponent } from './L1-items/users/nationality/nationality.component';
import { StackexchangeUrlComponent } from './L1-items/candidate/stackexchange-url/stackexchange-url.component';
import { DropdownMultiselectComponent } from './L0-components/forms-edit/dropdown-multiple/dropdown-multiple.component';
import { PersonalWebsiteUrlComponent } from './L1-items/candidate/personal-website-url/personal-website-url.component';
import { StackoverflowUrlComponent } from './L1-items/candidate/stackoverflow-url/stackoverflow-url.component';
import { ProfilePicComponent } from './L1-items/users/profile-pic/profile-pic.component';
import { CountryComponent } from './L1-items/users/country/country.component';
import { CityComponent } from './L1-items/users/city/city.component';
import { CurrentSalaryComponent } from './L1-items/candidate/current-salary/current-salary.component';
import { ToggleSwitchComponent } from './L0-components/forms-edit/toggle-switch/toggle-switch.component';
import { DropdownAutosuggestComponent} from './L0-components/forms-edit/dropdown-autosuggest/dropdown-autosuggest.component';
import { TimeSelectComponent } from './L0-components/forms-edit/time-select/time-select.component';
import { DateSelectComponent } from './L0-components/forms-edit/date-select/date-select.component';
import { ButtonGroupComponent } from './L0-components/forms-edit/button-group/button-group.component';
import { FileComponent } from './L0-components/forms-edit/file/file.component';
import { TextAreaViewComponent} from './L0-components/forms-view/text-area/text-area.component';
import { HtmlAreaViewComponent } from './L0-components/forms-view/html-area/html-area.component';
import { BadgeViewComponent} from './L0-components/forms-view/badge/badge.component';
import { ListComponent } from './L0-components/forms-view/list/list.component';
import { DateComponent } from './L0-components/forms-view/date/date.component';
import { WorkTypesComponent } from './L1-items/candidate/work-types/work-types.component';
import { RoleComponent } from './L1-items/candidate/role/role.component';
import { VolunteerComponent } from './L1-items/candidate/volunteer/volunteer.component';
import { LocationsComponent } from './L1-items/candidate/locations/locations.component';
import { ContractorComponent } from './L1-items/candidate/contractor/contractor.component';
import { EmployeeComponent} from './L1-items/candidate/employee/employee.component';
import {WhyWorkComponent} from './L1-items/candidate/why-work/why-work.component';
import { InterestsComponent } from './L1-items/candidate/interests/interests.component';
import { CommercialExperienceComponent } from './L1-items/candidate/commercial-experience/commercial-experience.component';
import { LogosItemsComponent } from './L0-components/icons/logos-items.component';
import { ExperimentedWithComponent } from './L1-items/candidate/experimented-with/experimented-with.component';
import { CommercialSkillsComponent } from './L1-items/candidate/commercial-skills/commercial-skills.component';
import { LanguagesComponent } from './L1-items/candidate/languages/languages.component';
import { EducationHistoryComponent } from './L1-items/candidate/education-history/education-history.component';
import { TextPasswordComponent } from './L0-components/forms-edit/text-password/text-password.component';
import { ContentComponent } from './L1-items/pages/content/content.component';
import { TitleComponent } from './L1-items/pages/title/title.component';
import { PagesEditorComponent } from './L2-pages/pages-editor/pages-editor.component';
import { PagesComponent } from './L2-pages/pages/pages.component';
import { ImageComponent} from './L0-components/forms-view/image/image.component';
import { CandidateViewComponent } from './L2-pages/candidate-view/candidate-view.component';
import { CandidateProgressbarComponent } from './L1-items/candidate/candidate-progressbar/candidate-progressbar.component';
import { TextLinkedIconComponent } from './L0-components/forms-view/text-linked-icon/text-linked-icon.component';
import { EditLinkIconComponent } from './L0-components/forms-view/edit-link-icon/edit-link-icon.component';
import { CandJobActivityComponent } from './L1-items/candidate/cand-job-activity/cand-job-activity.component';
import { ApproachOfferRateComponent } from './L1-items/candidate/approach-offer-rate/approach-offer-rate.component';
import { HowHearAboutWobComponent } from './L1-items/users/how-hear-about-wob/how-hear-about-wob.component';
import { HearAboutWobOtherInfoComponent } from './L1-items/users/hear-about-wob-other-info/hear-about-wob-other-info.component';
import { PricingComponent } from './L2-pages/pricing/pricing.component';
import { CompanyViewComponent } from './L2-pages/company-view/company-view.component';
import { SkillsAutoSuggestComponent } from './L1-items/users/skills-auto-suggest/skills-auto-suggest.component';
import { AddJobComponent } from './L2-pages/add-job/add-job.component';
import { ViewJobComponent } from './L2-pages/view-job/view-job.component';
import { NotRequireSkillsComponent } from './L1-items/users/not-require-skills/not-require-skills.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, CKEditorModule, ReactiveFormsModule, RouterModule, MatInputModule, MatSelectModule,
    MatAutocompleteModule, ImageCropperModule
  ],
  declarations: [
    SafeHtmlPipe, TextValueComponent, DashboardComponent, HtmlAreaComponent, TwitterShareComponent,
    DropdownSingleComponent, WizardsComponent, SocialLoginComponent,
    OthersComponent, AlertsComponent, AutosuggestSelectedValueComponent, TextInputComponent,
    TextAreaComponent, RadioComponent, FirstNameComponent, WorkHistoryComponent, CandidateEditComponent,
    CheckboxComponent, BioComponent, ContactNumberComponent, EmailAddressComponent, GithubUrlComponent, LastNameComponent,
    LinkedinUrlComponent, MediumUrlComponent, NationalityComponent, StackexchangeUrlComponent, DropdownMultiselectComponent,
    PersonalWebsiteUrlComponent, StackoverflowUrlComponent, ProfilePicComponent, CountryComponent, CityComponent,
    CurrentSalaryComponent, ToggleSwitchComponent, DropdownAutosuggestComponent, TimeSelectComponent, DateSelectComponent,
    ButtonGroupComponent, FileComponent, TextAreaViewComponent, HtmlAreaViewComponent, BadgeViewComponent, ListComponent,
    DateComponent, WorkTypesComponent, RoleComponent, VolunteerComponent, LocationsComponent, ContractorComponent,
    EmployeeComponent, WhyWorkComponent, InterestsComponent, CommercialExperienceComponent, LogosItemsComponent,
    CommercialSkillsComponent, ExperimentedWithComponent, LanguagesComponent, EducationHistoryComponent,
    TextPasswordComponent, ContentComponent, TitleComponent, PagesEditorComponent, PagesComponent, ImageComponent,
    CandidateViewComponent, CandidateProgressbarComponent, TextLinkedIconComponent, EditLinkIconComponent,
    CandJobActivityComponent, ApproachOfferRateComponent, HowHearAboutWobComponent, HearAboutWobOtherInfoComponent,
    PricingComponent, CompanyViewComponent, SkillsAutoSuggestComponent, AddJobComponent, ViewJobComponent,
    NotRequireSkillsComponent
  ],
  exports: [
    SafeHtmlPipe, FormsModule, CKEditorModule, ReactiveFormsModule, ImageCropperModule, MatInputModule, MatSelectModule,
    MatAutocompleteModule, CommonModule, TextValueComponent, DashboardComponent, DropdownSingleComponent, WizardsComponent,
    HtmlAreaComponent, TwitterShareComponent, SocialLoginComponent, OthersComponent, AlertsComponent,
    AutosuggestSelectedValueComponent, TextInputComponent, TextAreaComponent, RadioComponent, FirstNameComponent,
    WorkHistoryComponent, CandidateEditComponent, CheckboxComponent, BioComponent, ContactNumberComponent, EmailAddressComponent,
    GithubUrlComponent, LastNameComponent, LinkedinUrlComponent, MediumUrlComponent, NationalityComponent,
    StackexchangeUrlComponent, DropdownMultiselectComponent, PersonalWebsiteUrlComponent, StackoverflowUrlComponent,
    ProfilePicComponent, CountryComponent, CityComponent, CurrentSalaryComponent, ToggleSwitchComponent,
    DropdownAutosuggestComponent, TimeSelectComponent, DateSelectComponent, ButtonGroupComponent, FileComponent,
    TextAreaViewComponent, HtmlAreaViewComponent, BadgeViewComponent, ListComponent, DateComponent, WorkTypesComponent,
    RoleComponent, VolunteerComponent, LocationsComponent, ContractorComponent, EmployeeComponent, WhyWorkComponent,
    InterestsComponent, CommercialExperienceComponent, LogosItemsComponent, CommercialSkillsComponent,
    ExperimentedWithComponent, LanguagesComponent, EducationHistoryComponent, TextPasswordComponent, ContentComponent,
    TitleComponent, PagesEditorComponent, PagesComponent, ImageComponent, CandidateViewComponent,
    CandidateProgressbarComponent, TextLinkedIconComponent, EditLinkIconComponent, CandJobActivityComponent,
    ApproachOfferRateComponent, HowHearAboutWobComponent, HearAboutWobOtherInfoComponent, PricingComponent,
    CompanyViewComponent, SkillsAutoSuggestComponent, AddJobComponent, ViewJobComponent, NotRequireSkillsComponent
  ]
})
export class SharedModule { }
