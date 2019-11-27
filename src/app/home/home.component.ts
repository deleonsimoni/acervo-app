import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  modalRef: BsModalRef;
  @ViewChild('template', { static: false }) templateRef: TemplateRef<any>;

  constructor(private route: ActivatedRoute, private router: Router, private modalService: BsModalService) { }

  ngOnInit() {

    setTimeout(() => {
      this.modalRef = this.modalService.show(this.templateRef);
    }, 500);

  }

  itemPesquisa: String = "";

}
