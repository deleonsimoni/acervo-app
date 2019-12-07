import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  deleteDepoimento(idDepoimento) {
    this.depoimentoRemovido.emit(idDepoimento);
  }
  alterDepoimento(depoimento) {
    this.depoimentoAlterado.emit(depoimento);
  }

  sanitizeURL(url) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}