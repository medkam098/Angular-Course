import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberComponent } from './member/member.component';
import { MemberFormComponent } from './member-form/member-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToolComponent } from './tool/tool.component';
import { EventComponent } from './event/event.component';
import { LoginComponent } from './login/login.component';
import { ArticlesComponent } from './articles/articles.component';

const routes: Routes = [
  {
    path: 'members',
    component: MemberComponent,
  },
  {
    path: 'create',
    component: MemberFormComponent,
  },
  {
    path: 'delete/:id',
    component: MemberComponent,
  },
  {
    path: 'edit/:id',
    component: MemberFormComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'member',
    component: MemberComponent,
  },
  {
    path: 'tools',
    component: ToolComponent,
  },
  {
    path: 'articles',
    component: ArticlesComponent,
  },
  {
    path: 'events',
    component: EventComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full', // Default route
  },
  {
    path: '**',
    redirectTo: '/dashboard', // Wildcard route for a 404 page
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}