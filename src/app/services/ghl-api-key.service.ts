import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarToggleService } from './sidebar-toggle.service';
import { HandlerErrorService } from './handler-error.service';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GhlApiKeyService {
  ghlApiKeys: any[] = []
  currentGhlApiKey: any
  constructor(
    private http: HttpClient,
    private router: Router,
    public sidebarService: SidebarToggleService,
    private HandlerErrorSrv: HandlerErrorService
  ) { }


  addGHLApiKey(data: any) : Observable<any | void>{
    return this.http.post<any>(`${environment.API_URL}ghlApiKey/add`, data)
    .pipe(
      map((res:any)=> {
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  editGHLApiKey(data: any, apiKeyId: any) : Observable<any | void>{
    return this.http.put<any>(`${environment.API_URL}ghlApiKey/edit/${apiKeyId}`, data)
    .pipe(
      map((res:any)=> {
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  async getGHLApiKey(){
    const response: any = await this.http.get(`${environment.API_URL}ghlApiKey`).toPromise();
    console.log(response.ghlApiKey)
    this.ghlApiKeys = response.ghlApiKey;
    for (let index = 0; index < this.ghlApiKeys.length; index++) {
      const element = this.ghlApiKeys[index];
      if(element.status == 1){
        this.currentGhlApiKey = element;
      }
    }
    console.log(this.currentGhlApiKey)
  } 
}
