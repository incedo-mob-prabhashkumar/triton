import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgStyle } from '@angular/common';
import { DatastoreService } from '../datastore.service';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-gridselection',
  templateUrl: './gridselection.component.html',
  styleUrls: ['./gridselection.component.scss']

})
export class GridselectionComponent implements OnInit {
  public tiles: any;
  public hoverme: boolean;

  public twocrosstwo: any;
  public twocrossone: any;
  public onecrosstwo: any;
  public onecrossonevertical: any;
  public onecrossonehorizontal: any;
  public onecross: any;
  private _selectedGrid: any;
  public selected: string;
  //private _datastoreService:any;
  constructor(private _datastoreService: DatastoreService,
    private _router: Router,
    private _backendService:BackendService) {
    //  this._datastoreService=new DatastoreService();
    this.hoverme = false;
    this.tiles = [
      { text: 'one', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false },
      { text: 'two', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false },
      { text: 'three', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false },
      { text: 'four', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false },
      { text: 'five', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false },
      { text: 'six', cols: 2, rows: 2, color: 'grey', status: false, hoverstatus: false },
    ];
    this.twocrosstwo = [
      { sizeX: 2, sizeY: 1, row: 0, col: 0 },
      { sizeX: 2, sizeY: 2, row: 0, col: 2 },
      { sizeX: 1, sizeY: 1, row: 0, col: 4 },
      { sizeX: 1, sizeY: 1, row: 0, col: 5 },
    ];
    this.twocrossone = [
      { sizeX: 2, sizeY: 1, row: 0, col: 0 },
      { sizeX: 2, sizeY: 2, row: 0, col: 2 },
      { sizeX: 6, sizeY: 2, row: 0, col: 4 }
    ];
    this.onecrosstwo = [
      { sizeX: 2, sizeY: 1, row: 0, col: 0 },
      { sizeX: 2, sizeY: 2, row: 0, col: 2 },
      { sizeX: 1, sizeY: 1, row: 0, col: 4 }
    ];
    this.onecrossonevertical = [
      { sizeX: 2, sizeY: 1, row: 0, col: 0 },
      { sizeX: 2, sizeY: 2, row: 0, col: 2 }
    ];
    this.onecrossonehorizontal = [
      { sizeX: 6, sizeY: 2, row: 0, col: 0 },
      { sizeX: 6, sizeY: 2, row: 2, col: 0 }

    ];
    this.onecross = [
      { sizeX: 6, sizeY: 6, row: 0, col: 0 }
    ];

  }
  // selected grid click event
  selectedGrid($event: any, tile: any, tiles: any): void {

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

    switch (tile) {
      case "one": this._selectedGrid = this.twocrosstwo;
        break;
      case "two": this._selectedGrid = this.twocrossone;
        break;
      case "three": this._selectedGrid = this.onecrosstwo;
        break;
      case "four": this._selectedGrid = this.onecrossonevertical;
        break;
      case "five": this._selectedGrid = this.onecrossonehorizontal;
        break;
      case "six": this._selectedGrid = this.onecross;
        break;
      default: this._selectedGrid = this.twocrosstwo;
        break;
    }
    console.log(this._selectedGrid);
    //this.selected=this._selectedGrid[0].sizeX;
    return this._selectedGrid;
  }

  ngOnInit() {
    console.log("in Db selection");
    //bindEvent()
    let selectedDashboard: string = this._datastoreService.getSelectedDashboard();
    if (selectedDashboard) {
      this._backendService.getDashboardMetadata(selectedDashboard)// Gets the EMPTY metadata from server
        .subscribe(
          resDashboardMetadata => {
            this._datastoreService.setAppMetadata(resDashboardMetadata.data); //Sets metadata object and sets page reference
            // console.log(this._datastoreService.getAppMetadata());
            // this._datastoreService.appPage([{'q':'2'},{'y':'w'}]);
            // console.log(this._datastoreService.getAppMetadata());

          }
        );
    }
    else {
      //Will navigate to home page if user refresh the page
      this._router.navigate(['']);
    }

  }

}
