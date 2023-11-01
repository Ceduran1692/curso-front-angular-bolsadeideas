import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from '../region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  regiones:Region[];
  cliente:Cliente= new Cliente();
  titulo:string= "Crear Cliente"
  errores:String[]

  constructor(
    private clienteService:ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){}

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regs=>
        this.regiones=regs
    )
  }

  cargarCliente():void{
    this.activatedRoute.params.subscribe(params =>{
      let id= params['id']
      console.log(id)
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente =>{
          this.cliente= cliente
          console.log(`cliente: ${cliente.nombre}`)
        })
      }
    })
  }

  update():void{
    this.clienteService.update(this.cliente).subscribe(res=>{
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente Actualizado', `Cliente ${this.cliente.nombre}`,'success')
    },
    err => {
      console.error(`Error desde el backend ${err.status} `);
      console.error( err.error.error);
      this.errores = err.error.error as String[];
    })
  }

  create():void{
    console.log("Clicked");
    this.clienteService.create(this.cliente).subscribe(
      res => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo Cliente', `Cliente ${this.cliente.nombre}`,`success`)
      },
      err => {
        console.error(`Error desde el backend ${err.status} `);
        console.error( err.error.error);
        this.errores = err.error.error as String[];
      }
    )
  }

  compare(r1:Region,r2:Region):boolean{
    if(r1 == undefined && r2 == undefined){
      return true;
    }
    return (r1 != null && r2 != null) && (r1.id===r2.id);
  }
}
