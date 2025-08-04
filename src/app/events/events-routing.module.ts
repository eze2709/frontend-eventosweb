import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventDetailComponent } from './event-detail/event-detail.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'nuevo', component: EventFormComponent },
  { path: 'editar/:id', component: EventFormComponent },
  { path: ':id', component: EventDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
