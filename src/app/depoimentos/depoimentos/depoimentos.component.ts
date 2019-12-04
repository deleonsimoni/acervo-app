import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-depoimentos',
  templateUrl: './depoimentos.component.html',
  styleUrls: ['./depoimentos.component.scss']
})
export class DepoimentosComponent implements OnInit {

  @Input() depoimentos: any;
  @Input() isAdmin: boolean;
  @Output() depoimentoRemovido = new EventEmitter();
  @Output() depoimentoAlterado = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  deleteDepoimento(idDepoimento) {
    this.depoimentoRemovido.emit(idDepoimento);
  }
  alterDepoimento(depoimento) {
    this.depoimentoAlterado.emit(depoimento);
  }
}