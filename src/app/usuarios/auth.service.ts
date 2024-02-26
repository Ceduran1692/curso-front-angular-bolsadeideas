import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private httpHeaders= new HttpHeaders({'Content-type':'application/json'})
  private url:string= 'http://localhost:8080/auth';  
  private _usuario:Usuario= null;
  private _token:string= null;
  constructor(private http:HttpClient) { }

   login(usuario:Usuario):Observable<any>{
    return this.http.post<any>(this.url,{username:usuario.username,password:usuario.password},{headers:this.httpHeaders}).pipe(
      tap(jwt => console.log(jwt))
      )
   }

   public get usuario(){
      if(this._usuario==null && sessionStorage.getItem("usuario") != null){
        this._usuario= JSON.parse(sessionStorage.getItem("usuario")) as Usuario;
      }
      else if(this._usuario == null){
        this._usuario= new Usuario();
      }

      return this._usuario;
   }

   public get token(){
    if(this._token==null && sessionStorage.getItem("token") != null){
      this._token= sessionStorage.getItem("token");
    }
   
    return this._token;
 }

 hasRole(role: string) {
  return (this._usuario)?this._usuario.roles.some(rol => rol.authority == role):false;
}

   guardarUsuario(jwt:string){
      let payload= this.obtenerDatosToken(jwt);

      this._usuario= new Usuario;
      this._usuario.id=payload.id;
      this._usuario.nombre= payload.nombre;
      this._usuario.apellido=payload.apellido;
      this._usuario.email=payload.email;
      this._usuario.roles=payload.authorities;
      
      sessionStorage.setItem('usuario',JSON.stringify( this._usuario));
   }

   guardarToken(jwt:string){
      this._token=jwt;
      sessionStorage.setItem('token',this._token);
   }

   obtenerDatosToken(jwt:string):any{
     return (jwt != null)? JSON.parse(atob(jwt.split(".")[1])):null;
   }

   isAuthenticated(){
    let payload= this.obtenerDatosToken(this.token)
    return ( payload != null && payload.nombre.length > 0)
  }

  isTokenExpired(){
    let payload= this.obtenerDatosToken(this._token);
    let now= new Date().getTime() /1000;
    console.log('now: '+ now);
    console.log('token exp: '+ payload.exp);
    return payload.exp < now;
  }

  logOut():void{
      this._token= null;
      this._usuario= null;  
      sessionStorage.clear();
      
  }
}
