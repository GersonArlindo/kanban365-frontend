import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarToggleService } from './sidebar-toggle.service';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HandlerErrorService } from './handler-error.service';
import { ModalShowService } from './modal-show.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userToEdit: any
  constructor(
    private http: HttpClient,
    private router: Router,
    public sidebarService: SidebarToggleService,
    private HandlerErrorSrv: HandlerErrorService,
    public modalShowService: ModalShowService
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

  updateUser(data: any, id: any) : Observable<any | void>{
    return this.http.put<any>(`${environment.API_URL}user/update/${id}`, data)
    .pipe(
      map((res:any)=> {
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  checkEmail(email: any) : Observable<any | void>{
    return this.http.get<any>(`${environment.API_URL}user/check-email/${email}`)
      .pipe(
        map((res: any) => {
          return res
        }),
        catchError((err) => this.HandlerErrorSrv.handlerError(err))
      )
  }

  getUsers(): Observable<any>{
    return this.http.get<any>(`${environment.API_URL}users`)
    .pipe(
      map((response:any) => response.users),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    )
  } 

  deactivateUser(data: any, id: any) : Observable<any | void>{
    return this.http.put<any>(`${environment.API_URL}user/deactivate/${id}`, data)
    .pipe(
      map((res: any)=> {
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  activateUser(data: any, id: any) : Observable<any | void>{
    return this.http.put<any>(`${environment.API_URL}user/activate/${id}`, data)
    .pipe(
      map((res:any)=> {
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  setUserToEdit(user: any){
    this.userToEdit = user;
    console.log(this.userToEdit)
    this.modalShowService.showSettingsModal = false
    this.modalShowService.openViewProfileModal();
  }

}
