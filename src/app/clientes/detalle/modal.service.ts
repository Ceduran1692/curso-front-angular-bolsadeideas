import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modal:boolean
  private _notificarUpload= new EventEmitter<any>()
  constructor() { }

  get notificarUpload():EventEmitter<any>{
    return this._notificarUpload;
  }

  getModal():boolean{
    return this.modal;
  }

  abrirModal(){
    this.modal= true;
  }

  cerrarModal(){
    this.modal=false;
  }
}
