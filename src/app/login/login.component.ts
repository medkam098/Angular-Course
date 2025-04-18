import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private AS: AngularFireAuth, private router: Router) { }
email: string = '';
password: string = '';
sub(){
  console.log(this.email, this.password);
  this.AS.signInWithEmailAndPassword(this.email, this.password).then(() => {
    this.router.navigate(['member']);
})
}
}
