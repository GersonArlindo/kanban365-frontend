import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogin!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authSrv: AuthService,
  ){
    this.formLogin = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit() {
    const token = localStorage.getItem('token-kanban365');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      const isTokenValid = this.verifyToken(token);
      if (isTokenValid) {
        this.router.navigate(['/kanban365']);
      }
    }
  }

  verifyToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch (e) {
      return false;
    }
  }

  Login(){
    const data: any = {
      email: this.formLogin.value.username,
      password: this.formLogin.value.password
    }
    this.authSrv.login(data)
      .subscribe((res: any) => {
        if (res && res.token) { // Verifica si hay una respuesta con un token
          localStorage.setItem('token-kanban365', res.token); // Guarda el token en localStorage
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Signed in successfully"
          });
          this.router.navigate(['/kanban365']); // Redirige a la vista de kanban365
        }
      },
      (error) => {
        console.log(error)
        switch (error) {
          case 'Bad Request':
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Incorrect username or password!"
            });
            break; 
          case 'Internal Server Error':
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Internal Server Error!"
            });
            break;    
          case 'Unauthorized':
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Unauthorized"
            });
            break;    
          default:
            break;
        }
      })
  }
}
