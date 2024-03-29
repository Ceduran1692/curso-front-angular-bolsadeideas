import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { ClienteService } from './cliente.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';
import { HelperStrings } from '../helpers/helper.strings';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit{
  
  clientes: Cliente[];
  page:number;
  paginator: any;
  clienteSelect:Cliente;
  helperString:HelperStrings = new HelperStrings();

  constructor(
    private service:ClienteService,
    private activatedRoute:ActivatedRoute,
    private modal:ModalService,
    private authService: AuthService,
    
    ){}


  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params=>{
    this.page= (params['page']==undefined)? 0: +params['page']; //El operador + antes de una variable sirve para castearla a number
    this.service.getClientes(this.page).subscribe(
      (response) =>{ 
      console.log(`response: ${response}`)

      this.clientes= response.value.content as Cliente[];
      console.log(`clientes: ${this.clientes.length > 0}`)
      this.paginator= response.value;
      })
    },)

    this.modal.notificarUpload.subscribe(cliente=>{
      this.clientes.map(cli=>{
        if(cli.id==cliente.id){
          cli.foto= cliente.foto;
        }
      })
    })
  }
  

  hasRole(role){
    return this.authService.usuario.roles.some(rol => rol.authority == role);
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
          this.service.getClientes(this.page).subscribe(
            (response:any) => this.clientes= response.value.content as Cliente[]
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

  abrirModal(cliente:Cliente){
    this.clienteSelect= cliente;
    this.modal.abrirModal();
  }
  
   
}
