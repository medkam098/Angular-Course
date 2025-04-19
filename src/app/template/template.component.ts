import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent {
  @ViewChild('drawer') drawer!: MatSidenav;
  isMobile = false;
  inLogin = false;

  constructor(private breakpointObserver: BreakpointObserver,private authService: AuthService,private router: Router) {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        if (!this.isMobile && this.drawer) {
          this.drawer.close();
        }
      });
      this.router.events.subscribe(() => {
       this.inLogin = this.router.url.includes('/login');
       console.log("isLogin",this.inLogin);
      });
    

  }

  toggleDrawer(): void {
    this.drawer?.toggle();
  }
  onLogout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    });

    
  }
  
}