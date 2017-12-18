import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
@Injectable()
export class BackendService {
  // private _applicationUrl = "http://10.11.215.29/applicationList.json";
  // private _dashboardUrl = "http://10.11.215.29/dashboardList.json";
  // private _myDashboardList = "http://10.11.215.29/mydashboards.json";
  // private _dashboardMetadata = "http://10.11.215.29/emptyMetadata.json";
  // private _outputColumns="http://10.11.215.29/outputColumns.json";

   private _myDashboardList = "http://inquiry-dev3.nam.nsroot.net:8080/mobile/triton/jrs/simplequery/getLatestEditedDashboardsForUser";
 private _applicationUrl = "http://inquiry-dev3.nam.nsroot.net:8080/mobile/triton/jrs/simplequery/getAllInquiryAppsForEdit";
 private _dashboardUrl = "http://inquiry-dev3.nam.nsroot.net:8080/mobile/triton/jrs/simplequery/getDashboardsForEditByApp_Id";
 private _dashboardMetadata = "http://inquiry-dev3.nam.nsroot.net:8080/mobile/triton/ifts/getDashboardMetaDataForEdit";
 private _outputColumns="http://inquiry-dev3.nam.nsroot.net:8080/mobile/triton/ifts/lookUpOutputColumnsForDashboardId";
  private _saveDashboard="http://inquiry-dev3.nam.nsroot.net:8080/mobile/triton/ifts/saveDashboard";
constructor(private _http: Http) { 
    localStorage["smuser"]="VS19704";
  }
  getApplicationList(data) {
    var url="";
    console.log("in service" + data);
    if(data)
      {
        url=this._applicationUrl + "?query=" + data+"&SM_USER="+localStorage["smuser"];
        
      }
      else
        {
          url=this._applicationUrl + "?SM_USER="+localStorage["smuser"];
        }
    
    return this._http.get(url)
      .map((response: Response) => response.json());
  }
  getDashboardList(data, APP_ID) {
    
    var url="";
    
  if(data)
    {
      url=this._dashboardUrl + "?query=" + data + "&APP_ID=" + APP_ID+"&SM_USER="+localStorage["smuser"];
    }
    else{
      url=this._dashboardUrl + "?APP_ID=" + APP_ID+"&SM_USER="+localStorage["smuser"];
    }
    return this._http.get(url)
      .map((response: Response) => response.json());
  }
  getMyDashboardsList() {
    return this._http.get(this._myDashboardList+"?SM_USER="+localStorage["smuser"])
      .map((response: Response) => response.json());
  }
  getDashboardMetadata(selectedDashboard) {
   // console.log(selectedDashboard.dashboard.DASHBOARD_ID);
     return this._http.get(this._dashboardMetadata+"?DASHBOARD_ID="+selectedDashboard.dashboard.ID+"&SM_USER="+localStorage["smuser"])
      .map((response: Response) => response.json());
  }
  getOutputColumns(selectedDashboard)
  {
   // console.log(selectedDashboard.dashboard.DASHBOARD_ID);
    return this._http.get(this._outputColumns+"?DASHBOARD_ID="+selectedDashboard.dashboard.ID+"&SM_USER="+localStorage["smuser"])
    .map((response:Response)=>response.json());
  }
  publishAppMetadata(metadata){
    //let a={};
    //a.DASHBOARDJSON="";
    let a=JSON.stringify(metadata)
    console.log(a);
    return this._http.post(this._saveDashboard+"?SM_USER="+localStorage["smuser"]+"&DASHBOARDJSON="+a,"")
    .map((response:Response)=>response.json());
  }
}
