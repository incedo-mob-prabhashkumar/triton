import { Component,ViewEncapsulation } from '@angular/core';
import {BackendService} from './backend.service';
import {DatastoreService} from './datastore.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[BackendService,DatastoreService]
  
})
export class AppComponent {
  title = 'app';


  
}
