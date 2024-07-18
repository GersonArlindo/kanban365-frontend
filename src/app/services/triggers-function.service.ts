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

  //*Este servicio sera para traer los disparadores unicamente
  getTriggersFunctions(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}triggers`)
    .pipe(
      map((response:any) => response.triggers),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    )
  } 

  //*Servicios para consumir los endpoints de los associated triggers
  addAssociatedTriggersFunctions(data: any) : Observable<any | void>{
    return this.http.post<any>(`${environment.API_URL}associatedTrigger/add`, data)
    .pipe(
      map((res:any)=> {
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  getAssociatedTriggersFunctions(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}associatedTrigger`)
    .pipe(
      map((response:any) => response.triggers),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    )
  } 

  getAssociatedTriggersFunctionsByArrayTriggerId(data: any) : Observable<any | void>{
    return this.http.post<any>(`${environment.API_URL}associatedTriggers`, data)
    .pipe(
      map((response:any) => response),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    )
  }

  deleteAssociatedTriggersFunctions(id: any) : Observable<any | void>{
    return this.http.delete<any>(`${environment.API_URL}associatedTriggers/delete/${id}`)
    .pipe(
      map((response:any) => response),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    )
  }


}
