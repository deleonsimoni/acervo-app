import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare var google: any;

interface Galeria {
  titulo: string;
  descricao: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  geocoder: any;
  modalRef: BsModalRef;

  public submissionForm: FormGroup;
  public carregando = false;
  galeriaLista = [];
  public galeria: Galeria = {
    titulo: "", descricao: ""
  };
  categoria = 0;
  public categorias = [
    { id: 1, name: 'Depoimentos' },
    //{ id: 1, name: 'Museus pedagógicos' },
    { id: 2, name: 'Museus de escola' },
    { id: 3, name: 'Centros de memoria' },
    { id: 4, name: 'Outros museus e centros de memórias internacionais' },
    { id: 5, name: 'Escolas' },
    { id: 6, name: 'Arte educação' },
    { id: 7, name: 'Escolinhas de arte do Brasil' },
    { id: 8, name: 'Formação docente' }
  ];
  galleries: any;
  id: any = null;

  constructor(
    public mapsApiLoader: MapsAPILoader,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private http: HttpClient,
  ) {
    this.mapsApiLoader = mapsApiLoader;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.submissionForm = this.builder.group({
      categoria: [null],
      nomeInstituicao: [null],
      lat: [null],
      lng: [null]
    });
  }

  placeMarker(position: any) {
    const lat = position.coords.lat;
    const lng = position.coords.lng;

    this.submissionForm.patchValue({
      nomeInstituicao: "",
      lat: lat,
      lng: lng
    });
    this.id = null;
    this.galeriaLista = [];
  }

  selectMarker(position: any) {
    this.submissionForm.patchValue({
      categoria: position.categoria,
      nomeInstituicao: position.nomeInstituicao,
      lat: position.lat,
      lng: position.lng
    });
    this.id = position._id;
    this.galeriaLista = position.galeria;
  }

  public upload() {
    if (!this.submissionForm.value.categoria) {
      this.toastr.error('Selecione uma categoria.', 'Atenção');
      return;
    } if (!this.submissionForm.value.nomeInstituicao) {
      this.toastr.error('Escreva o nome da Instituição.', 'Atenção');
      return;
    } if (!this.submissionForm.value.lng) {
      this.toastr.error('Marque uma posição no mapa.', 'Atenção');
      return;
    } else {
      this.carregando = true;

      //this.submissionForm.value.arquivo = this.arquivo[0];
      this.submissionForm.value.galeria = this.galeriaLista;

      const formData: FormData = new FormData();

      //formData.append('fileArray', this.arquivo[0], `teste/${this.arquivo[0].name}`);
      formData.append('formulario', JSON.stringify(this.submissionForm.value));

      this.http.post(`api/user/upload/`, formData).subscribe((res: any) => {
        this.carregando = false;

        if (res && res.temErro) {
          this.toastr.error(res.mensagem, 'Erro: ');
        } else {
          this.toastr.success('Arquivo enviado com sucesso', 'Sucesso');
          this.galeriaLista = [];
          this.submissionForm.reset();
        }
      }, err => {
        this.carregando = false;
        this.toastr.error('Servidor momentaneamente inoperante.', 'Erro: ');
      });
    }
  }

  findLocation(address) {
    if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
    this.geocoder.geocode({
      'address': address.target.value
    }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        for (var i = 0; i < results[0].address_components.length; i++) {
          let types = results[0].address_components[i].types;
        }

        if (results[0].geometry.location) {
          this.submissionForm.get('lat').setValue(results[0].geometry.location.lat());
          this.submissionForm.get('lng').setValue(results[0].geometry.location.lng());
        }
      } else {
        alert("Desculpa, mas a pesquisa não trouxe resultados");
      }
    });
  }
  
  openModal(template: TemplateRef<any>, pos: any) {
    //this.gallerieSelect = [ pos ];
    this.modalRef = this.modalService.show(template);
    return false;
  }

  addGaleria(){
    if (!this.galeria.titulo) {
      this.toastr.error('Escreva o nome do depoente', 'Atenção');
      return;
    } if (!this.galeria.descricao) {
      this.toastr.error('Escreva o depoimento', 'Atenção');
      return;
    }

    if (this.id){
      const formData: FormData = new FormData();

      let aux = {
        galeria: this.galeria,
        id: this.id
      }

      formData.append('galeria', JSON.stringify(aux));

      this.http.post(`api/user/upload-galeria/`, formData).subscribe((res: any) => {
        this.carregando = false;

        if (res && res.temErro) {
          this.toastr.error(res.mensagem, 'Erro: ');
        } else {
          this.galeriaLista.push(this.galeria);
          this.galeria = {
            titulo: "", descricao: ""
          };
          this.toastr.success('Arquivo enviado com sucesso', 'Sucesso');
        }
      }, err => {
        this.carregando = false;
        this.toastr.error('Servidor momentaneamente inoperante.', 'Erro: ');
      });
    } else {
      this.galeriaLista.push(this.galeria);
      this.galeria = {
        titulo: "", descricao: ""
      };
    }
  }

  mudarCategoria(){
    this.http.get("api/user/getGallerys?categoria=" + this.submissionForm.get('categoria').value).subscribe((res: any) => {
      this.galleries = res;
      this.carregando = false;
      this.id = null;
      this.galeriaLista = [];

      this.submissionForm.patchValue({
        nomeInstituicao: "",
        lat: null,
        lng: null
      });
    }, err => {
    });
  }
}