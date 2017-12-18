import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MdSnackBar, MdSnackBarConfig, MdSnackBarRef } from '@angular/material';
import { DatastoreService } from '../datastore.service';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboardeditor',
  templateUrl: './dashboardeditor.component.html',
  styleUrls: ['./dashboardeditor.component.scss']
})
export class DashboardeditorComponent implements OnInit {
  private pagePreview: any;
  public selectedGridReference: any;
  public dashboardName: string;
  public dataWidgets: any;
  public showWidget: boolean;
  public showProp: boolean;
  public dataGrid: any;
  public dataGrid2: any;
  public simpleDrop: any = null;
  transferData: Object = { id: 1, msg: 'Hello' };
  public receivedData: Array<any> = [];
  public dataAfterDrag: any;
  public pageList: Array<any> = [];
  public mydialog;
  public Groups: Array<any> = [];
  public Dimentions: Array<any> = [];
  public StabColumns: Array<any> = [];
  public selectedGroups: Array<any> = [];
  public selectedDimentions: Array<any> = [];
  public selectedTitle = { title: '' };
  public selectedStab: Array<any> = [];
  private _setBorder: boolean;
  // public static item: any;
  public selectedIndexValue: any;
  public dtstore: any;
  public disableProp: boolean;
  public msg: string;
  public showSpinner: boolean = false;
  private _pageIdList: Array<any>;

  constructor(public dialog: MdDialog,

    public snackBar: MdSnackBar,
    private _backendService: BackendService,
    private _datastoreService: DatastoreService,
    private _router: Router) {
    // this.dtstore=_dataStoreService;
    this.disableProp = true;
    this.mydialog = this.dialog;
    this.dashboardName = "";
    this.showWidget = false;
    this.showProp = false;
    this._setBorder = true;

    this.Groups = ["SLASTATUS", "SLABREACH", "WARNING", "REGION"];
    this.Dimentions = ["SLASTATUS", "SLABREACH", "WARNING", "REGION"];
    this.StabColumns = ["col1", "col2", "col3", "col3"];
    this.dataWidgets = [
      { text: 'pie', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, path: '../assets/pie.png' },
      { text: 'stab', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, path: '../assets/table.png' },
      { text: 'line', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, path: '../assets/line.png' },
      { text: 'bar', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, path: '../assets/bar.png' },
      { text: 'stackbar', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, path: '../assets/stack.png' }


    ];
    
    this.pageList = [];

    this.dataAfterDrag = {};

  }
  closedashboard() {
    this._router.navigate(['dblist']);
  }
  deletePage(page) {
    console.log(page);
    this.msg = "Are you sure you want to delete the current Page?";
    this.openCommonDailog(page);
}
  // show widget
  openWidget(): void {
    this.showWidget = true;
  }
  hideWidget(): void {
    this.showWidget = false;
  }
  // show hide property
  openProp() {
    // alert("in child");

    this.showProp = true;
  }
  hideProp() {
    this.showProp = false;
  }


  transferDataSuccess($event: any, data: any): any {

    console.log($event)
    this.removeAndADDElement($event.mouseEvent);
    //this.receivedData=[]; 
    this.dataAfterDrag = $event.dragData;
    data.type = this.dataAfterDrag.text;
    if (data.type == 'stab') {
      data.table = true;
    }
    else {
      data.table = false;
    }
    console.log(data);
    //this.Groups=data.groupKeys;
    this.selectedGridReference = data;
    this.disableProp = false;
    this.setProperties(data);
    console.log(this.Groups);




  }

  omit_special_char(e) {

    var
      k;

    document.all ?
      k =
      e.keyCode :
      k = e.which;

    return ((k >
      64 &&
      k < 91) || (k >
        96 &&
        k < 123) ||
      k == 8 ||
      k == 32 || (k >=
        48 &&
        k <= 57));

  }

  // load prop
  loadProp($event: any, data: any) {
    // alert('in load prop');
    console.log($event)
    console.log($event.path.find(function (element) {
      return element.localName == "md-grid-tile";
    }));

    this.setProperties(data);
    this.selectedGridReference = data;
    this.disableProp = false;
    this.removeAndADDElement($event)
  }
  // for adding border
  removeAndADDElement($event: any) {
    console.log($event.target.parentElement.classList);

    let list: any = document.getElementsByClassName("page-grid-common")
    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove('border-tile-grid');
    }
    $event.path.find(function (element) {
      return element.localName == "md-grid-tile";
    }).className += " border-tile-grid";
  

  }
  /**
 * clear selection
 */

  clearSelection() {
    this.selectedGridReference = null;
    this.disableProp = true;
    this.selectedGroups = null;
    this.selectedDimentions = null;;
    this.selectedStab = null;
    this.selectedTitle.title = null;
    let list: any = document.getElementsByClassName("page-grid-common")
    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove('border-tile-grid');
    }
  }
  /**
    * open  common dialog
    */

  openCommonDailog(page: any) {
    let dialogCom = this.dialog.open(DialogCommon, {
      width: '400px',
      disableClose: true,
      ariaDescribedBy: "cmdl",
      data: { msg: this.msg, id: "delpageDl" }
    });

    dialogCom.afterClosed().subscribe(result => {
      console.log(result)
      if (result == "OK") {
        this.clearSelection();

        console.log(this.pageList[page].pageId);
        var freePageID = this.pageList[page].pageId;
        this.pageList.splice(page, 1);
        this.pageList = this.pageList;
        console.log(this.pageList);
        console.log(this._datastoreService.getAppMetadata());
        for (let i = 0; i < this.pageList.length; i++) {
          this.pageList[i].index = i + 1;
        }
        this._pageIdList.push(freePageID);
        console.log(this._pageIdList);
        this._pageIdList.sort();
        console.log(this._pageIdList);
      }
      else {
        this.clearSelection();
      }

    });
  }
  /**
   * 
   * publich dialog
   */

  openCommonDialogForPublish() {

    let msg: string = "Publish Dashboard?";
    let dCFPublish = this.dialog.open(DialogCommon, {
      width: '400px',
      disableClose: true,
      ariaDescribedBy: "cmFP",
      data: { msg: msg, id: "publishDL" }
    });

    dCFPublish.afterClosed().subscribe(result => {
      console.log(result)
      if (result == "OK") {
        this.clearSelection();
        this.showSpinner = true;
        let data = {};
        data = this._datastoreService.getAppMetadata();
        console.log(data);
        this._backendService.publishAppMetadata(data)
          .subscribe(resPublishMetadata => {
            this.showSpinner = false;
            if (resPublishMetadata.success) {
              this.snackBar.open("Dashboard published successfully!!!", "", { duration: 3000 });
            }
            else {
              this.snackBar.open("Failed to publish dashboard!!!", "", { duration: 3000 });
            }
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log(resPublishMetadata);
          }, error => {
            //console.log(error);
            this.showSpinner = false;
            this.snackBar.open("Failed to publish dashboard!!!", "", { duration: 3000 });
          });
      }
      else {
        this.clearSelection();
      }
    });
  }
  /**
   * preview dialog
   */

  preview() {
    var metadata = this._datastoreService.getAppMetadata();
    sessionStorage["metadata"] = JSON.stringify(metadata);
    if (this.pagePreview) { this.pagePreview.close() };
    this.pagePreview = window.open("Triton/www/index.html", "_preview", "width=1024,height=665");
    
  }

  openDialog(): void {
    if (this.pageList.length < 9) {
      this.mydialog = this.dialog.open(gridselectionDialog, {
        height: '100%',
        width: '100%'
      });
      this.mydialog.afterClosed().subscribe(result => {
        console.log(result);
        if (result && result != 'CLOSE') {
          result.pageId = this._pageIdList[0];
          console.log(result.grid)
          // console.log(this._datastoreService.getChartID());
          for (var i = 0; i < result.grid.length; i++) {
            result.grid[i].chartId = "C" + (parseInt(this._pageIdList[0]) * 10 + i + 1);

          }
          result.index = this.pageList.length + 1;
          this.pageList.push(result);
          this._pageIdList.splice(0, 1)
          this.alterIndexGrid(this.pageList)
          console.log(this.pageList);
          //  this._datastoreService.addPage(this.pageList)
          this.selectedIndexValue = this.pageList.length - 1;
        }

        console.log("Dialog result:" + result); // Pizza!
      });
    }
    else {
      this.snackBar.open("You cannot add more than 9 pages", "", { duration: 4000 });
    }
  }

  closeDialog(data): void {
    //console.log(this.mydialog);
    this.mydialog.close(data);
  }
  setProperties(data: any) {
    //this.Groups = [];
    //this.Dimentions = [];
    //this.StabColumns = [];

    this.selectedGroups = data.groupKeys;
    this.selectedDimentions = data.dimensionsKeys;
    this.selectedStab = data.stabColumns;
    this.selectedTitle.title = data.title;
  }
  onSelectedGroup(value: Array<any>) {
    console.log(this.selectedGroups);
    // console.log(this.selectedObject);
    this.selectedGridReference.groupKeys = this.selectedGroups;
    //this.selectedGroups = value;
  }
  onSelectedDimentions(value: Array<any>) {
    console.log(value);
    //  this.selectedDimentions = value;
    this.selectedGridReference.dimensionsKeys = this.selectedDimentions;
    console.log(this._datastoreService.getAppMetadata());
  }
  onSelectedStab(value: Array<any>) {
    console.log(value);
    this.selectedGridReference.stabColumns = this.selectedStab;
  }
  onSelected() {
    // create one more arry which match the required no of data rows
  }
  titleChange(data) {

    this.selectedGridReference.title = data;
  }
  isGridSelected(event) {
    console.log(event)
    if (!this.selectedGridReference) {
      //  this.snackBar.dismiss();
      // this.snackBar.dismiss();
      // var s=new MdSnackBarRef(this.snackBar,)
      //this.snackBar._openedSnackBarRef.afterDismissed
      //let ss=new MD
      let config = new MdSnackBarConfig();
      config.direction = 'ltr';
      config.politeness = "assertive";
      config.extraClasses = ["test"];
      config.duration = 3000;

      this.snackBar.open("Please select any grid first!!!", "", config);

    }
  }
  commonMethod() {
    alert("in commen");
  }
  publish() {
    console.log(this.pageList);
    this.clearSelection();
    if(this.validateBeforePublish())
    {
      this.openCommonDialogForPublish();
    }
    else
    {
      this.snackBar.open("Please fill all grid properties before publishing", "", { duration: 3000 });
    }
   
  }
  validateBeforePublish():boolean{
    let isValidated:boolean=true;
    for(let i=0;i<this.pageList.length;i++)
    {
        for(let j=0;j<this.pageList[i].grid.length;j++)
        {
            if(this.pageList[i].grid[j].type.trim().length>0)
            {
              if(this.pageList[i].grid[j].type=='stab')
              {
                if(this.pageList[i].grid[j].dimensionsKeys.length==0 
                  || this.pageList[i].grid[j].groupKeys.length==0
                  || this.pageList[i].grid[j].title.length==0 
                  || this.pageList[i].grid[j].stabColumns.length==0 )
                  {
                    isValidated=false;
                    break;
                  }
              }
              else{
                if(this.pageList[i].grid[j].dimensionsKeys.length==0 
                  || this.pageList[i].grid[j].groupKeys.length==0
                  || this.pageList[i].grid[j].title.length==0  )
                  {
                    isValidated=false;
                    break;
                  }
              }
              
            }
            else{
              isValidated=false;
              break;
            }
        }
    }
    return isValidated;
  }
  ngOnChanges() {

  }

  ngOnInit() {

    let selectedDashboard: string = this._datastoreService.getSelectedDashboard();
    if (selectedDashboard) {
      this._backendService.getDashboardMetadata(selectedDashboard)// Gets the EMPTY metadata from server
        .subscribe(
        resDashboardMetadata => {
          if (resDashboardMetadata.success && resDashboardMetadata.data["0"].mobileapp.applications["0"].dashboards["0"].pages) {
            this._backendService.getOutputColumns(selectedDashboard)
              .subscribe(resOutputColumns => {
                if (resOutputColumns.success) {
                  this.Groups = resOutputColumns.data;
                  this.StabColumns = resOutputColumns.data;
                  this.Dimentions = resOutputColumns.data;
                  this.dashboardName = resDashboardMetadata.data["0"].mobileapp.applications["0"].dashboards["0"].dashboardName;
                  this._datastoreService.resetPageID();
                  this._datastoreService.setAppMetadata(resDashboardMetadata); //Sets metadata object and sets page reference
                  let pageReference = this._datastoreService.getPageReference();
                  // for (var i = 0; i < pageReference.length; i++) {
                  //   this.pageList.push(pageReference[i]);
                  // }
                  this.pageList = pageReference;
                  this._pageIdList = this._datastoreService.getPageIDList();
                  this.alterIndexGrid(this.pageList)

                  if (this.pageList.length == 0)
                    this.openDialog();
                }
                else {
                  this.snackBar.open("Some error occured", "", { duration: 3000 });
                }
              }, error => {
                this.snackBar.open("Some error occured", "", { duration: 3000 });
              });

            // console.log(this._datastoreService.getAppMetadata());
            // this._datastoreService.appPage([{'q':'2'},{'y':'w'}]);
            // console.log(this._datastoreService.getAppMetadata());
          }
          else {
            this.snackBar.open("Some error occured", "", { duration: 3000 });
          }
        }, error => {
          this.snackBar.open("Some error occured", "", { duration: 3000 });
        }
        );
    }
    else {
      //Will navigate to home page if user refresh the page
        this._router.navigate(['']);
    }

    // /**SetTimeout is work around. Incedo team to resolve.**/
    // setTimeout(() => {
    //   /*Check if the already existed pages are received from API */
    //   if (this.pageList.length == 0)
    //     this.openDialog()
    // }, 1);
  }

  /**
    * 
    * alter page list
    */
  alterIndexGrid(pagelist) {

    for (let i = 0; i < pagelist.length; i++) {
      let gridType: number = pagelist[i].grid.length;
      this.setGrid(pagelist[i].grid);

    }

  }

  setGrid(grid) {
    console.log("grid to beselected")
    console.log(grid);

    for (let i = 0; i < grid.length; i++) {
      if ((grid[i].col == "0" && grid[i].row == "0")) {
        //  alert(grid[i].col+":"+grid[i].row)  
        console.log(grid);
        this.move(i, 0, grid)
      }
      if ((grid[i].col == 3 && grid[i].row == 0)) {
        //  alert(grid[i].col+":"+grid[i].row)   
        console.log(grid);
        this.move(i, 1, grid)
      }
      if ((grid[i].col == 0 && grid[i].row == 2)) {
        //   alert(grid[i].col+":"+grid[i].row) 
        console.log(grid);
        this.move(i, 2, grid)
      }
      if ((grid[i].col == 3 && grid[i].row == 2)) {
        //    alert(grid[i].col+":"+grid[i].row)  
        console.log(grid);
        this.move(i, 3, grid)
      }
    }

  }
  move(old_index, new_index, grid) {
    let arr: Array<any> = grid;
    if (new_index >= arr.length) {
      var k = new_index - arr.length;
      /*  while ((k--) + 1) {
          arr.push(undefined);
        }*/
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    //this.setGrid(grid);
    return arr; // for testing purposes
  }

}


/**
 * @title Basic progress-spinner
 */
@Component({
  selector: 'progress-spinner',
  template: '<md-spinner></md-spinner>',
})
export class ProgressSpinner { }

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<span class="snackbar-style">Please select any grid first</span>'
})
export class SnackBarComponent { }

@Component({
  templateUrl: './gridselection.dialog.html',
  styleUrls: ['./gridselection.dialog.scss']
})

export class gridselectionDialog {
  public tiles: any;
  public hoverme: boolean;
  public twocrosstwo: any;
  public twocrossone: any;
  public onecrosstwo: any;
  public onecrossonevertical: any;
  public onecrossonehorizontal: any;
  public onecross: any;
  public selectedGrid: any;
  public selected: string;
  private _mdialog;
  constructor(public dialog: MdDialogRef<gridselectionDialog>,
    private _dataStoreService: DatastoreService) {
    //super(dialog);
    this._mdialog = dialog;
    //  this._dbeditor = new DashboardeditorComponent(this._mdialog,this._backendService,this._dataStoreService);
    this.hoverme = false;
    this.tiles = [
      { text: 'one', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, imgsrc: '../../assets/twoxtwo.png' },
      { text: 'two', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, imgsrc: '../../assets/twoxone.png' },
      { text: 'three', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, imgsrc: '../../assets/onextwo.png' },
      { text: 'four', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, imgsrc: '../../assets/onexonevert.png' },
      { text: 'five', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, imgsrc: '../../assets/onexonehoriz.png' },
      { text: 'six', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false, imgsrc: '../../assets/onex.png' },
    ];
    this.twocrosstwo = {
      'pageId': '', 'index': 0, 'grid': [
        { type: '', sizeX: 3, sizeY: 2, row: 0, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 3, sizeY: 2, row: 0, col: 3, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 3, sizeY: 2, row: 2, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 3, sizeY: 2, row: 2, col: 3, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false }


      ]
    }
    this.twocrossone = {
      'pageId': '', 'index': 0, 'grid': [
        { type: '', sizeX: 3, sizeY: 2, row: 0, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 3, sizeY: 2, row: 0, col: 3, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 6, sizeY: 2, row: 2, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false }
      ]
    }
    this.onecrosstwo = {
      'pageId': '', 'index': 0, 'grid': [
        { type: '', sizeX: 6, sizeY: 2, row: 0, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 3, sizeY: 2, row: 2, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 3, sizeY: 2, row: 2, col: 3, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false }
      ]
    }
    this.onecrossonevertical = {
      'pageId': '', 'index': 0, 'grid': [
        { type: '', sizeX: 3, sizeY: 4, row: 0, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 3, sizeY: 4, row: 0, col: 3, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false }
      ]
    }
    this.onecrossonehorizontal = {
      'pageId': '', 'index': 0, 'grid': [
        { type: '', sizeX: 6, sizeY: 2, row: 0, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false },
        { type: '', sizeX: 6, sizeY: 2, row: 2, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false }
      ]
    }
    this.onecross = {
      'pageId': '', 'index': 0, 'grid': [
        { type: '', sizeX: 6, sizeY: 4, row: 0, col: 0, dimensionsKeys: [], groupKeys: [], stabColumns: [], title: "", chartId: "", toShow: true, table: false }
      ]
    }

    // this.openDialog();

  }
  // selected grid click event
  selectGrid($event: any, tile: any, tiles: any): void {

    for (var i = 0; i < tiles.length; i++) {
      tiles[i].status = false;
    }
    tile.status = true;
    this.selectFromGridList(tile);
  }
  onMouseOver(tile: any): void {
    //alert()
    tile.hoverstatus = true;
  }

  onMouseOut(tile: any): void {
    tile.hoverstatus = false;
  }
  selectFromGridList(tile: any): any {
    switch (tile.text) {
      case "one": this.selectedGrid = this.twocrosstwo;
        break;
      case "two": this.selectedGrid = this.twocrossone;
        break;
      case "three": this.selectedGrid = this.onecrosstwo;
        break;
      case "four": this.selectedGrid = this.onecrossonevertical;
        break;
      case "five": this.selectedGrid = this.onecrossonehorizontal;
        break;
      case "six": this.selectedGrid = this.onecross;
        break;
      default: this.selectedGrid = this.twocrosstwo;
        break;
    }
    console.log(this.selectedGrid);
    console.log(this.selectedGrid.grid.length);
  }

  ngOnInit() {
    console.log("in Db selection");
    //bindEvent()
  }
}
@Component({
  selector: 'dialog-common',
  templateUrl: './dEDialogCommon.html',
  styleUrls: ['./dEDilaogCommon.scss'],
})
export class DialogCommon {

  constructor(
    public dialogCom: MdDialogRef<DialogCommon>, @Inject(MD_DIALOG_DATA) public data: any) { }

  closeCD(): void {
    // alert()
    this.dialogCom.close();
  }
  closePreview(): void {
    this.dialogCom.close();
  }
  closePublish(): void {
    this.dialogCom.close();
  }




}