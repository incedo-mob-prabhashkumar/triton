import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { DashboardlistComponent }  from '../dashboardlist/dashboardlist.component';
import { GridselectionComponent }  from '../gridselection/gridselection.component';
import { DashboardeditorComponent }  from '../dashboardeditor/dashboardeditor.component';
import { PagenotfoundComponent }  from '../pagenotfound/pagenotfound.component';
const routes: Routes = [{
        path: 'dblist',
        component: DashboardlistComponent,
        
    },
    {
        path: 'gridselect',
        component: GridselectionComponent,
    },
    {
        path: 'dbeditor',
        component: DashboardeditorComponent,
    },
    {
        path: '**',
        component: DashboardlistComponent,
    },
    { path: '', component: DashboardlistComponent },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
