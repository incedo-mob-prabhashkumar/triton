import { Injectable } from '@angular/core';

@Injectable()
export class DatastoreService {

  private _selectedDashboard: any;
  private _appMetadata: any;
  private _pageReference: Array<any>;
  private _pageID: number;
  private _availablePageId:Array<any>;
  private _chartID: number;

  constructor() {
    this._pageID = 0;
    this._availablePageId=[];
  }
  // Sets referenece of choosen dashboard
  setSelectedDashboard(selectedDashboard) {
   // alert(selectedDashboard);
    this._selectedDashboard = selectedDashboard;
  }
  // Return referenece of choosen dashboard
  getSelectedDashboard(): any {
    console.log(this._selectedDashboard);
    return this._selectedDashboard;
  }

  //Sets metadata JSON
  setAppMetadata(metadata) {
    
    this._appMetadata = metadata;
    this._pageReference = this._appMetadata.data[0].mobileapp.applications[0].dashboards[0].pages;
    var dbid=(this._appMetadata.data[0].mobileapp.applications[0].dashboards[0].dashboardId).split('D')[1];
    this._availablePageId=[];
    for(let i=1;i<=9;i++)
      {
        let pageID =(parseInt(dbid))*10+i;
        this._availablePageId.push(pageID.toString());
      }
      console.log(this._availablePageId);
    // if(this._pageReference.length==0)
    //   {
    //     var dbid=(this._appMetadata.data[0].mobileapp.applications[0].dashboards[0].dashboardId).split('D')[1];
    //     this._pageID=(parseInt(dbid))*10;
    //   }
    for(let i=0;i<this._pageReference.length;i++)
      {
        if(this._availablePageId.indexOf(this._pageReference[i].pageId)>-1)
          {
            this._availablePageId.splice(this._availablePageId.indexOf(this._pageReference[i].pageId),1);
          }
        // if(parseInt(this._pageReference[i].pageId)>this._pageID)
        //   {
        //     this._pageID=parseInt(this._pageReference[i].pageId);
        //     console.log("latest page id"+this._pageID);
        //   }
         
      }
      console.log(this._availablePageId);
  }
  //Gets metadata JSON
  getAppMetadata() {
    return this._appMetadata;
  }
  // addPage(data) {
  //   console.log(data);
  //   this._pageReference.splice(0, this._pageReference.length);
  //   for (var i = 0; i < data.length; i++) {
  //     this._pageReference.push(data[i]);
  //   }
  // }
  getPageReference() {
    return this._pageReference;
  }
  getPageIDList(): any {
   // this._pageID++;
    //return this._pageID.toString();
    return this._availablePageId;
  }
  getChartID():any{
   this._chartID= this._pageID*10;
    return this._chartID;
  }
  resetPageID(){
    this._pageID=0;
  }
}
