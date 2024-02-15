import { Injectable } from "@angular/core";
import { Cliente } from "./cliente";
import { CLIENTES } from "./clientes.json";
import { Observable, of, throwError } from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse, HttpStatusCode } from "@angular/common/http";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ClienteResponse } from "./cliente.response";
import { DatePipe, formatDate } from "@angular/common";
import { Region } from "./region";
import { AuthService } from "../usuarios/auth.service";


@Injectable()
export class ClienteService{
    
    private url:string= 'http://localhost:8080/cliente'
    private httpHeaders= new HttpHeaders({'Content-type':'application/json'})
     

    constructor(
        private http:HttpClient,
        private router: Router,
        private authService:AuthService
        ){}


    private agregarAuthorization(){
        const token= this.authService.token;
        if(!this.httpHeaders.has("Authorization")){
            this.httpHeaders= (token != null)? this.httpHeaders.append('Authorization','Bearer ' +token) : this.httpHeaders;
        }
        console.log('header: '+ this.httpHeaders.get('Authorization'));
        return this.httpHeaders
        
        
    }

    private autorizado(e):Boolean{
        let autorizado:boolean = true;
        if(e.status==401){
            this.router.navigate(['/login']);
            autorizado=false;
        }

        if(e.status==403){
            Swal.fire('Acceso denegado',`Hola ${this.authService.usuario.nombre} no tienes acceso a este recurso`, 'warning');
            this.router.navigate(['/clientes']);
            autorizado=false;
        }

        if(!this.authService.isAuthenticated()){
            this.authService.logOut();
        }
        return autorizado ;
    }

    getClientes(page:number): Observable<any>{
        //llamada api simplificada
        //return this.http.get<Cliente[]>(this.url);

        //Usando pipe y map para mapear la respuesta http
        
        return this.http.get<any>(`${this.url}/page/${page}`,{headers: this.agregarAuthorization()}).pipe(
            tap(response => {
                console.log('veo los clientes con tap (tap no modifica)')
                let clientes= response.value.content as Cliente[];
                clientes.forEach(cli=> console.log(cli))
            }),

            map((response) => {
                    (response.value.content as Cliente[]).map(cliente => {
                        cliente.nombre= cliente.nombre.toLowerCase();
                        cliente.apellido= cliente.apellido.toLowerCase();
                        cliente.email= cliente.email.toLowerCase();
                        let datePipe= new DatePipe('es');
                        cliente.createAt= datePipe.transform(cliente.createAt,'EEEE dd,MMMM yyyy')//formatDate(cliente.createAt,'dd-MM-yyyy', 'en-US')
                        return cliente;
                    });
                    return response;
                
            }),
            
            catchError(e => {
                this.router.navigate(['/clientes'])
                console.error("en el catch: "+e)
                console.error(e)
                Swal.fire(`Error: ${e?.status}`, e.error.mensaje, 'error')
                return throwError(()=>new Error(e))
            })
        );
        
    };

    delete(id:number):Observable<Cliente>{
         
        return this.http.delete<any>(`${this.url}/${id}`,{headers: this.agregarAuthorization()}).pipe(
            map(rsp => rsp.value as Cliente),
            catchError(e => {
                if(this.autorizado(e)){
                    return throwError(()=>new Error(e))
                }
                console.error(e.mensaje)
                Swal.fire(e.mensaje, e.error, 'error')
                return throwError(()=>new Error(e))
            })
        );
    }
    

    update(cliente):Observable<Cliente>{
        return this.http.put<any>(`${this.url}/${cliente.id}`,cliente,{headers: this.agregarAuthorization()}).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {
                if(this.autorizado(e)){
                    return throwError(()=>new Error(e))
                }
                if(e.status == HttpStatusCode.BadRequest){
                    return throwError(()=>new Error(e));
                }
                console.error(e.mensaje)
                Swal.fire(e.mensaje, e.error, 'error')
                return throwError(()=>new Error(e));
            })
        )
    }

    getRegiones():Observable<Region[]>{
        return this.http.get<any>(`${this.url}/regiones`,{headers: this.agregarAuthorization()}).pipe(
            map(rsp=> rsp.value as Region[]),
            
            catchError(e => {
                this.router.navigate(['/clientes']);
                console.error(e.mensaje)
                this.autorizado(e);
                return throwError(()=>new Error(e))
            })
        )
    }

    getCliente(id):Observable<Cliente>{
        return this.http.get<any>(`${this.url}/${id}`,{headers: this.agregarAuthorization()}).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {
                if(this.autorizado(e)){
                    console.log("No autorizado")
                    return throwError(()=>new Error(e))
                }
                this.router.navigate(['/clientes']);
                console.error(e.mensaje)
                Swal.fire(e.mensaje, e.error, 'error')
                return throwError(()=>new Error(e))
            })
        );
    }

    create(cliente:Cliente):Observable<Cliente>{
        return this.http.post<any>(this.url,cliente,{headers: this.agregarAuthorization()}).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {
                if(this.autorizado(e)){
                    console.log("No autorizado")
                    return throwError(()=>new Error(e))
                }

                if(e.status == HttpStatusCode.BadRequest){
                    return throwError(()=>new Error(e))
                }
                
                console.error(e.error.msg)
                Swal.fire(e.msg, e.error, 'error')
                return throwError(()=>new Error(e))
            })
        )
    }

    subirfoto(archivo:File, id):Observable<HttpEvent<{}>>{
        let formData= new FormData();
        formData.append("archivo", archivo);
        formData.append("id",id);
        
        const token= this.authService.token;
        const headers= (token != null)? new HttpHeaders({'Authorization':'Bearer ' +token}) : new HttpHeaders();
        
        console.log('subir fotos header:' + headers.keys())
        console.log('auth header:' + headers.get('Authorization'))


        const req= new HttpRequest('POST',`${this.url}/upload`,formData,{
            reportProgress: true,
            headers: headers
        })

         return this.http.request<any>(req).pipe(
            catchError(e => {
                this.autorizado(e);
                return throwError(()=>new Error(e))
            })
        ) 
        
        // return this.http.post<any>(`${this.url}/upload`, formData,{
        //     reportProgress: true,
        //     headers: headers
        // }).pipe(
        //     catchError(e => {
        //         this.autorizado(e);
        //         if(e.status == HttpStatusCode.BadRequest){
        //             return throwError(()=>new Error(e))
        //         }else{
        //         console.error(e.error.msg)
        //         Swal.fire(e.msg, e.error, 'error')
        //         return throwError(()=>new Error(e))
        //         }
        //     })
        // );
        
    }

    
}