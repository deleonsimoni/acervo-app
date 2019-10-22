import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor(
    @Inject('BASE_API_URL') private baseUrl: string,
    private http: HttpClient
  ) { }

  getFile(fileName, success, falha) {
    this.http.get(`${this.baseUrl}/user/downloadFile?fileName=${fileName}`).subscribe((res: any) => {
      const arrayBufferView = new Uint8Array(res.data.Body.data);
      const blob = new Blob([arrayBufferView], { type: 'application/octet-stream' });
      saveAs(blob, fileName);
      success();
    }, err => {
      falha(err);
    });
  }
}
