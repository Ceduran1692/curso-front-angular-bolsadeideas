import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  cliente:Cliente= new Cliente()
  titulo:string= "Crear Cliente"

  constructor(
    private clienteService:ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){}

  ngOnInit(): void {
    this.cargarCliente()
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
    })
  }

  create():void{
    console.log("Clicked");
    this.clienteService.create(this.cliente).subscribe(
      res => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo Cliente', `Cliente ${this.cliente.nombre}`,`success`)
      }
    )
  }
}
