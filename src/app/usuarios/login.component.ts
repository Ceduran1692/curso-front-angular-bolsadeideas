import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit{
  titulo:String= "Login";
  usuario:Usuario
  constructor(private authservice:AuthService, private router:Router){
    this.usuario= new Usuario();
  }

  ngOnInit(): void {
    if(this.authservice.isAuthenticated()){
      this.router.navigate(['/clientes']);
      Swal.fire('Login',`Hola ${this.authservice.usuario.nombre} que bueno verte de nuevo`, 'info')
    }
  }

  login():void{
    console.log(this.usuario)
    if(this.usuario.username == null || this.usuario.password==null){
      Swal.fire('Error login', 'campos vacios','error' )
      return;
    }

    this.authservice.login(this.usuario).subscribe({
        next: res=>{
          this.authservice.guardarUsuario(res.jwt);
          this.authservice.guardarToken(res.jwt);
          this.usuario=this.authservice.usuario;
          this.router.navigate(['/clientes'])
          Swal.fire('Login',`Bienvenido ${this.usuario.nombre} que bien que hayas venido`, 'success')
        },
        error: err=>{
          if(err.status==HttpStatusCode.BadRequest){
            Swal.fire('Error Login','Username o password invalida','error');
          }
        }
    })
  }
}
