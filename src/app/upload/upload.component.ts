import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  geocoder: any;

  public submissionForm: FormGroup;
  public carregando = false;
  private arquivo: FileList;

  public categorias = [
    { id: 1, name: 'Museus pedagógicos' },
    { id: 2, name: 'Museus de escola' },
    { id: 3, name: 'Centros de memoria' },
    { id: 4, name: 'Outros museus e centros de memórias internacionais' },
    { id: 5, name: 'Escolas' },
    { id: 6, name: 'Arte educação' },
    { id: 7, name: 'Escolinhas de arte do Brasil' },
    { id: 8, name: 'Formação docente' }
  ];

  constructor(
    public mapsApiLoader: MapsAPILoader,
    private builder: FormBuilder,
    private toastr: ToastrService,
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
      titulo: [null],
      nomeInstituicao: [null],
      descricao: [null],
      lat: [-22.893244],
      lng: [-43.1234836]
    });
  }

  placeMarker(position: any) {
    const lat = position.coords.lat;
    const lng = position.coords.lng;

    this.submissionForm.get('lat').setValue(lat);
    this.submissionForm.get('lng').setValue(lng);
  }

  public getFileName(): string {
    const fileName = this.arquivo ? this.arquivo[0].name : 'Arquivo para o acervo';
    return fileName;
  }

  public setFileName(files: FileList): void {
    this.arquivo = files;
  }

  public upload() {
    if (!this.arquivo) {
      this.toastr.error('É necessário selecionar um arquivo para upload', 'Atenção');
      return;
    } if (this.arquivo[0].size > 7000 * 1027) {
      this.toastr.error('O arquivo excede o tamanho máximo', 'Atenção');
      return;
    } if (!this.submissionForm.value.categoria) {
      this.toastr.error('Selecione uma categoria.', 'Atenção');
      return;
    } if (!this.submissionForm.value.titulo) {
      this.toastr.error('Escreva o titulo do arquivo', 'Atenção');
      return;
    } if (!this.submissionForm.value.nomeInstituicao) {
      this.toastr.error('Escreva o nome da Instituição.', 'Atenção');
      return;
    } if (!this.submissionForm.value.lng) {
      this.toastr.error('Marque uma posição no mapa.', 'Atenção');
      return;
    } if (!this.submissionForm.value.descricao) {
      this.toastr.error('Escreva a descrição', 'Atenção');
      return;
    } else {
      this.carregando = true;

      this.submissionForm.value.arquivo = this.arquivo[0];

      const formData: FormData = new FormData();

      formData.append('fileArray', this.arquivo[0], `teste/${this.arquivo[0].name}`);
      formData.append('formulario', JSON.stringify(this.submissionForm.value));

      this.http.post(`api/user/upload/`, formData).subscribe((res: any) => {
        this.carregando = false;

        if (res && res.temErro) {
          this.toastr.error(res.mensagem, 'Erro: ');
        } else {
          this.toastr.success('Arquivo enviado com sucesso', 'Sucesso');
          this.submissionForm.reset();
          this.arquivo = null;
        }
      }, err => {
        this.carregando = false;
        this.toastr.error('Servidor momentaneamente inoperante.', 'Erro: ');
      }
      );
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
}