import { Injectable } from "@angular/core";
import { Cliente } from "./cliente";
import { CLIENTES } from "./clientes.json";
import { Observable, of, throwError } from "rxjs";
import {catchError, map} from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpStatusCode } from "@angular/common/http";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ClienteResponse } from "./cliente.response";


@Injectable()
export class ClienteService{
    private url:string= 'http://localhost:8080/cliente'
    private httpHeaders= new HttpHeaders({'Content-type':'application/json'})
    
    constructor(
        private http:HttpClient,
        private router: Router){}

    getClientes(): Observable<Cliente[]>{
        //llamada api simplificada
        //return this.http.get<Cliente[]>(this.url);

        //Usando pipe y map para mapear la respuesta http
        
        return this.http.get<ClienteResponse>(this.url).pipe(
            map(response => response.value as Cliente[]),
            
            catchError(e => {
                this.router.navigate(['/clientes'])
                console.error(e.error.msg)
                Swal.fire(`Error: ${e.error.msg}`, e.error.error, 'error')
                return throwError(e)
            })
        );
        
    };

    delete(id:number):Observable<Cliente>{
         
        return this.http.delete<ClienteResponse>(`${this.url}/${id}`).pipe(
            map(rsp => rsp.value as Cliente),
            catchError(e => {
                console.error(e.error.msg)
                Swal.fire(e.error.msg, e.error.error, 'error')
                return throwError(e)
            })
        );
    }
    

    update(cliente):Observable<Cliente>{
        return this.http.put<ClienteResponse>(`${this.url}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {
                if(e.status == HttpStatusCode.BadRequest){
                    return throwError(e);
                }
                console.error(e.error.msg)
                Swal.fire(e.error.msg, e.error.error, 'error')
                return throwError(e)
            })
        )
    }

    getCliente(id):Observable<Cliente>{
        return this.http.get<ClienteResponse>(`${this.url}/${id}`).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {
                this.router.navigate(['/clientes']);
                console.error(e.error.msg)
                Swal.fire(e.error.msg, e.error.error, 'error')
                return throwError(e)
            })
        );
    }

    create(cliente:Cliente):Observable<Cliente>{
        return this.http.post<ClienteResponse>(this.url,cliente,{headers:this.httpHeaders}).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {

                if(e.status == HttpStatusCode.BadRequest){
                    return throwError(e);
                }
                console.error(e.error.msg)
                Swal.fire(e.error.msg, e.error.error, 'error')
                return throwError(e)
            })
        )
    }
}