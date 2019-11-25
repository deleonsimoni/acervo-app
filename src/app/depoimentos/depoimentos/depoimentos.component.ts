import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-depoimentos',
  templateUrl: './depoimentos.component.html',
  styleUrls: ['./depoimentos.component.scss']
})
export class DepoimentosComponent implements OnInit {

  @Input() depoimentos: any;

  constructor() { }

  ngOnInit() {
  }
}