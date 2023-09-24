import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { Router } from '@angular/router';

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
    private router: Router
    ){}
  ngOnInit(): void {
    
  }

  create():void{
    console.log("Clicked");
    this.clienteService.create(this.cliente).subscribe(
      res => this.router.navigate(['/clientes'])
    )
  }
}
