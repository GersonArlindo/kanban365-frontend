import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarToggleService } from './sidebar-toggle.service';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HandlerErrorService } from './handler-error.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    public sidebarService: SidebarToggleService,
    private HandlerErrorSrv: HandlerErrorService
  ) { }

  login(data:any) : Observable<any | void>{
    return this.http.post<any>(`${environment.API_URL}login`, data)
    .pipe(
      map((res:any)=> {
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  addUser(data: any) : Observable<any | void>{
    return this.http.post<any>(`${environment.API_URL}user/add`, data)
    .pipe(
      map((res:any)=> {
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }
}
