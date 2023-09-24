import { Injectable } from "@angular/core";
import { Cliente } from "./cliente";
import { CLIENTES } from "./clientes.json";
import { Observable, of } from "rxjs";
import {map} from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable()
export class ClienteService{
    private url:string= 'http://localhost:8080/cliente'
    private httpHeaders= new HttpHeaders({'Content-type':'application/json'})
    
    constructor(private http:HttpClient){}

    getClientes(): Observable<Cliente[]>{
        //llamada api simplificada
        return this.http.get<Cliente[]>(this.url);

        //Usando pipe y map para mapear la respuesta http
        /*
        return this.http.get(this.url+'/cliente/findAll').pipe(
            map(response => response as Cliente[])
        );
        */
    };

    create(cliente:Cliente):Observable<Cliente>{
        return this.http.post<Cliente>(this.url,cliente,{headers:this.httpHeaders})
    }
}