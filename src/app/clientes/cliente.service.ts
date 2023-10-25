import { Injectable } from "@angular/core";
import { Cliente } from "./cliente";
import { CLIENTES } from "./clientes.json";
import { Observable, of, throwError } from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpResponse, HttpStatusCode } from "@angular/common/http";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ClienteResponse } from "./cliente.response";
import { DatePipe, formatDate } from "@angular/common";


@Injectable()
export class ClienteService{
    private url:string= 'http://localhost:8080/cliente'
    private httpHeaders= new HttpHeaders({'Content-type':'application/json'})
    
    constructor(
        private http:HttpClient,
        private router: Router){}

    getClientes(page:number): Observable<any>{
        //llamada api simplificada
        //return this.http.get<Cliente[]>(this.url);

        //Usando pipe y map para mapear la respuesta http
        
        return this.http.get<any>(`${this.url}/page/${page}`).pipe(
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
                return throwError(e)
            })
        );
        
    };

    delete(id:number):Observable<Cliente>{
         
        return this.http.delete<any>(`${this.url}/${id}`).pipe(
            map(rsp => rsp.value as Cliente),
            catchError(e => {
                console.error(e.mensaje)
                Swal.fire(e.mensaje, e.error, 'error')
                return throwError(e)
            })
        );
    }
    

    update(cliente):Observable<Cliente>{
        return this.http.put<any>(`${this.url}/${cliente.id}`,cliente,{headers:this.httpHeaders}).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {
                if(e.status == HttpStatusCode.BadRequest){
                    return throwError(e);
                }
                console.error(e.mensaje)
                Swal.fire(e.mensaje, e.error, 'error')
                return throwError(e)
            })
        )
    }

    getCliente(id):Observable<Cliente>{
        return this.http.get<any>(`${this.url}/${id}`).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {
                this.router.navigate(['/clientes']);
                console.error(e.mensaje)
                Swal.fire(e.mensaje, e.error, 'error')
                return throwError(e)
            })
        );
    }

    create(cliente:Cliente):Observable<Cliente>{
        return this.http.post<any>(this.url,cliente,{headers:this.httpHeaders}).pipe(
            map(rsp => rsp.value as Cliente),

            catchError(e => {

                if(e.status == HttpStatusCode.BadRequest){
                    return throwError(e);
                }
                console.error(e.error.msg)
                Swal.fire(e.msg, e.error, 'error')
                return throwError(e)
            })
        )
    }
}