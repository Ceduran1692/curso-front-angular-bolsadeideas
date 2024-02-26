import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import Swal from "sweetalert2";

 @Injectable()
export class LoginInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,private router:Router) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      // Get the auth token from the service.
      const authToken = this.authService.token
  
  
      // send cloned request with header to the next handler.
      return next.handle(req).pipe(
        catchError(e =>{
        if(e.status==401){
            if(!this.authService.isAuthenticated()){
                this.authService.logOut();
            }
            this.router.navigate(['/login']);
        }

        if(e.status==403){
            Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.nombre} no tienes acceso a este recurso`, 'warning');
            this.router.navigate(['/clientes']);
        }

        
        return throwError(()=>new Error(e)) ;
        })
      );
    }
  }