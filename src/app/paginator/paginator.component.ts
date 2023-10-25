import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'nav-paginator',
  templateUrl: './paginator.component.html',
  
})
export class PaginatorComponent implements OnInit, OnChanges{

  @Input() paginator:any;
  pages:number[];
  minPage:number;
  maxPage:number;


  constructor(){
  }
  ngOnChanges(changes: SimpleChanges): void {
    let prevPaginator= changes["paginator"]

    if(prevPaginator.previousValue){
      this.setPaginator()
    }
  }
  
  

  ngOnInit(){
    this.setPaginator();
    console.log(this.pages.length);
  }
  

  private setPaginator(){
    this.minPage= Math.min(Math.max(1,this.paginator.number-4),this.paginator.totalPages-5);
    this.maxPage= Math.max(Math.min(this.paginator.number+4,this.paginator.totalPages),6);

    if(this.paginator.totalPages > 5){
      this.pages= new Array(this.maxPage-this.minPage+1).fill(0).map((_valor,index)=> index+this.minPage)
    }else{
      this.pages= new Array(this.paginator.totalPages).fill(0).map((_valor,index)=> index+1)
    }
  }
}
