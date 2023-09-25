import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { ClienteService } from './cliente.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';


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

  delete(cliente:Cliente):void{

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success m-2',
        cancelButton: 'btn btn-danger m-2'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Estas seguro?',
      text: "No se podran revertir los cambios",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, no entiendes?',
      cancelButtonText: 'No, Perdon soy un pelotudo',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(cliente.id).subscribe( rsp=>{
          this.service.getClientes().subscribe(
            clientes => this.clientes= clientes
          );
            Swal.fire(
              'Borrado!',
              'El cliente ha sido borrado.',
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tienes suerte de que yo no sea tan bobo como tu',
          'error'
        )
      }
    })
  }
  
}
