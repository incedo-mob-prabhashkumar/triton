import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MdSnackBar,MdSnackBarConfig,MdSnackBarRef} from '@angular/material';
import { BackendService } from '../backend.service';
import { DatastoreService } from '../datastore.service';
import { Router } from '@angular/router';

class Application {
  public APP_ID: object;
  public APP_NAME: object;
}
class Dashboard {
  public ID: object;
  public LABEL: object;
}

class SetSelectedDashboard {
  public application: Application;
  public dashboard: Dashboard;
}
@Component({
  selector: 'app-dashboardlist',
  templateUrl: './dashboardlist.component.html',
  styleUrls: ['./dashboardlist.component.scss']

})

export class DashboardlistComponent implements OnInit {


  public applicationCtrl: FormControl;
  public dashboardCtrl: FormControl;
  public filteredApplications: any;
  public filteredDashboards: any;
  public applicationValue: any;
  public dashboardValue: any;
  public myDashboardList: any;
  public editButtonDisabled: boolean;
  private err:boolean;

  constructor(private _backendService: BackendService,
    public snackBar:MdSnackBar,
    private _datastoreService: DatastoreService,
    private _router: Router) {
    this.editButtonDisabled = true;
    this.applicationCtrl = new FormControl();
    this.dashboardCtrl = new FormControl();
    this.applicationCtrl.valueChanges
      .subscribe(data => {
       console.log(this.applicationValue);
       
        if (this.applicationValue && this.applicationValue.APP_NAME && this.applicationValue.APP_ID) {
          this.dashboardCtrl.enable();
        }
        else {
          this.dashboardValue = "";
          this.dashboardCtrl.disable();
        }
        
        if(data)
          {
        this._backendService.getApplicationList(data)
          .subscribe(
          resApplicationList => {
            if(resApplicationList.success)
              {
                this.filteredApplications = resApplicationList.data;
              }
              else{
                this.snackBar.open("Some error occured","",{duration:3000});
              }
         
          },error=>{
            this.snackBar.open("Some error occured","",{duration:3000});
          });
      }});
     

    this.dashboardCtrl.valueChanges
      .subscribe(data => {
        console.log(this.dashboardValue);
        if (this.dashboardValue && this.dashboardValue.LABEL && this.dashboardValue.ID) {
          this.editButtonDisabled = false;
        }
        else {
          this.editButtonDisabled = true;
        }
        if(data)
          {
        this._backendService.getDashboardList(data, this.applicationValue.APP_ID)
          .subscribe(
          resDashboardList => {
            if(resDashboardList.success){
            this.filteredDashboards = resDashboardList.data;
          }
          else{
            this.snackBar.open("Some error occured","",{duration:3000});
          }
     
          },error=>{
            this.snackBar.open("Some error occured","",{duration:3000});
          });
      }});

  }
  ngOnInit() {
    //this._datastoreService.resetPageID();
    this._backendService.getMyDashboardsList()
      .subscribe( 
      resMyDashboardsList => {
        if(resMyDashboardsList.success){
      this.myDashboardList = resMyDashboardsList.data;
    }
    else{
      this.snackBar.open("Some error occured","",{duration:3000});
    }

      },error=>{
        this.snackBar.open("Some error occured","",{duration:3000});
      });
  }
 
  displayFnForApplication(application: Application): any {
    return application ? application.APP_NAME : application;
 }

 displayFnForDashboard(dashboard: Dashboard): any {
  return dashboard ? dashboard.LABEL : dashboard;
}
  public listApplications() {
    this._backendService.getApplicationList(null)
      .subscribe(
      resApplicationList => {
        if(resApplicationList.success){
        this.filteredApplications = resApplicationList.data;
      }
      else{
        this.snackBar.open("Some error occured","",{duration:3000});
      }
 
      },error=>{
        this.snackBar.open("Some error occured","",{duration:3000});
      });
  }

  public listDashboards() {
    console.log("clicked");
    this._backendService.getDashboardList(null, this.applicationValue.APP_ID)
      .subscribe(
      resDashboardList => {
        if(resDashboardList.success){
        this.filteredDashboards = resDashboardList.data;
      }
      else{
        this.snackBar.open("Some error occured","",{duration:3000});
      }
 
      },error=>{
        this.snackBar.open("Some error occured","",{duration:3000});
      });
  }
  public editDashboard() {
    console.log(this.filteredApplications);

    let objSetSelectedDashboard = new SetSelectedDashboard();
    let objApplication=new Application();
    
    objApplication.APP_ID=this.applicationValue.APP_ID;
    objApplication.APP_NAME=this.applicationValue.APP_NAME;
    objSetSelectedDashboard.application = objApplication;

    let objDashboard=new Dashboard();
    
    objDashboard.ID=this.dashboardValue.ID;
    objDashboard.LABEL=this.dashboardValue.LABEL;

    objSetSelectedDashboard.dashboard = objDashboard;
    console.log(this.applicationCtrl);
    console.log(this.applicationValue);
    console.log(this.dashboardValue);
    this._datastoreService.setSelectedDashboard(objSetSelectedDashboard);
    this._router.navigate(['dbeditor']);
  }

  private editMyDashboard(selectedItem){
    console.log(selectedItem);
    let objSetSelectedDashboard = new SetSelectedDashboard();
    let objApplication=new Application();
    let objDashboard=new Dashboard();
    objApplication.APP_ID=selectedItem.APP_ID;
    objApplication.APP_NAME=selectedItem.APP_NAME;
    objDashboard.ID=selectedItem.DASHBOARD_ID;
    objDashboard.LABEL=selectedItem.DASHBOARD_NAME;
    objSetSelectedDashboard.application = objApplication;
    objSetSelectedDashboard.dashboard = objDashboard;
    
    this._datastoreService.setSelectedDashboard(objSetSelectedDashboard);
    this._router.navigate(['dbeditor']);
  }
  //triton logo path
  public imagePath: string = "../../assets/logo-triton.png"
  //latest edit logo path
  public latestEditIconPath = "../../assets/threelines.png"
  //graph icon path
  private _graphIconPath = "../../assets/graph.png"
  //description 
 // public description: string = " Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32."
  public description: string = "";

}


