import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { ClienteService } from './cliente.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit{
  
  clientes: Cliente[];
  
  constructor(private service:ClienteService){}


  ngOnInit(): void {
    this.service.getClientes().subscribe(
      clientes => this.clientes= clientes
    );
  }
  
}
