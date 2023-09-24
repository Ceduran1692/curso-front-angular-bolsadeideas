import { Component, OnInit } from '@angular/core';
import { DirectivaService } from './directiva.service';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit{
    directivas: string[];
    visible: boolean= false;

    constructor(private service:DirectivaService){}  
  
    ngOnInit(): void {
      this.directivas= this.service.getDirectivas();
    }


    setVisible():void{
      this.visible= !this.visible;
    }

}
