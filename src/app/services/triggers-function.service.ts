import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarToggleService } from './sidebar-toggle.service';
import { HandlerErrorService } from './handler-error.service';
import { ModalShowService } from './modal-show.service';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TriggersFunctionService {

  constructor(
    private http: HttpClient,
    private router: Router,
    public sidebarService: SidebarToggleService,
    private HandlerErrorSrv: HandlerErrorService,
    public modalShowService: ModalShowService
  ) { }

  getTriggersFunctions(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}triggers`)
    .pipe(
      map((response:any) => response.triggers),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    )
  } 
}
