import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ModalShowService } from 'src/app/services/modal-show.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-modal-frame',
  templateUrl: './profile-modal-frame.component.html',
  styleUrls: ['./profile-modal-frame.component.scss']
})
export class ProfileModalFrameComponent {
  formCreateUser!: FormGroup
  selectedRole: number = 2; // Valor inicial
  selectedStatus: number = 1
  isExternalUser: boolean = false
  constructor(
    formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private UserSrv: AuthService,
    private openModalSrv: ModalShowService
  ){
    this.formCreateUser = formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    })
  }
    @Input() first_name:string = "";
    @Input() last_name:string = "";
    @Input() email:string = "";
    @Input() phone_number:string = "";
    @Input() rol_name:string = "";
    @Input() tenant_id:string = "";


    ngOnInit(){
    }

    createUserHandler(){
      const generateRandomString = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      }
      const data: any = {
        first_name: this.formCreateUser.value.first_name,
        last_name: this.formCreateUser.value.last_name,
        username: this.formCreateUser.value.first_name + ' ' + this.formCreateUser.value.last_name,
        user_image: 'no-image.png',
        email: this.formCreateUser.value.email,
        phone_number: this.formCreateUser.value.phone_number,
        rol_id: this.isExternalUser ? 1 :  this.selectedRole, // 1 = Admin , 2 = User
        status: this.selectedStatus,
        password: this.formCreateUser.value.password,
        confirm_password: this.formCreateUser.value.confirm_password,
        created_by: this.first_name + ' ' + this.last_name,
        tenant_id: this.isExternalUser 
        ? `${this.formCreateUser.value.first_name}${this.formCreateUser.value.last_name}_${generateRandomString(10)}` 
        : this.tenant_id
      }
      if(data.password != data.confirm_password){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Passwords do not match!"
        });
        return
      }

      this.UserSrv.checkEmail(data.email)
        .subscribe((res: any) => {
          if(res.exists == true){
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "The email already exists in our database!"
            });
            console.log(res)
            return
          }else{
            this.UserSrv.addUser(data)
            .subscribe((res: any) => {
              if(res){
                Swal.fire({
                  title: "Good job!",
                  text: "Your user has been saved!",
                  icon: "success"
                })
                setTimeout(() => {
                  window.location.reload()
                }, 1000);
              }else{
                alert("Ups, An error has occurred!")
              }
            })
          }
        })
      console.log(data)
    }

    changeStatus(status: any) {
      this.selectedStatus = status
      console.log(this.selectedStatus)
    }

    changeRole(role: any){
      this.selectedRole = role
      console.log(this.selectedRole)
    }

    externalUserHandler(event: any){
      this.isExternalUser = event.target.checked
      console.log(this.isExternalUser)
    }

    logOut(){
      localStorage.removeItem('token-kanban365');
      window.location.reload()
    }
}
