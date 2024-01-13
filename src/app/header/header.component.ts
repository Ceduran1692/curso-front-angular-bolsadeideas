import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  titulo:string= 'Clientes-App';

  constructor(private authService:AuthService,
              private router:Router){}

  isAuthenticated():boolean{
    return this.authService.isAuthenticated();
  };

  logOut():void{
    this.authService.logOut();
    console.log('log out')
    this.router.navigate(['/login'])
  }
}


