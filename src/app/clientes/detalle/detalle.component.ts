import { Component, Input, OnInit, } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType, HttpUploadProgressEvent } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'cliente-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit{
  
  @Input() cliente:Cliente;
  titulo:String= "Detalle";
  progress:number=0;
  fotoSeleccionada:File;

  constructor(private clienteService:ClienteService,private modal:ModalService){

  }


  ngOnInit(): void {
    
  }

  seleccionarFoto(event){
    this.fotoSeleccionada= event.target.files[0];
    this.progress=0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image')<0){
      swal.fire('Error', 'Debe seleccionar un archivo del tipo imagen', 'error');
      this.fotoSeleccionada=null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      swal.fire('Error upload', 'Debe seleccionar una imagen', 'error');
    }else{
      this.clienteService.subirfoto(this.fotoSeleccionada,this.cliente.id)
      .subscribe(event=>{
        if(event.type === HttpEventType.UploadProgress){
          this.progress= Math.round(100*event.loaded/event.total);
        
        }else if(event.type === HttpEventType.Response){
          let response:any= event.body;
          console.log(response.value);
          this.cliente= response.value as Cliente;
          this.modal.notificarUpload.emit(this.cliente);
          swal.fire("la foto se subio con exito", `La foto se subio correctamente`,'success')

        }
        
      })
    }
  }

  getModal():boolean{
    return this.modal.getModal();
  }

  cerrarModal(){
    this.modal.cerrarModal();
    this.progress=0;
    this.fotoSeleccionada=null
  }

}
