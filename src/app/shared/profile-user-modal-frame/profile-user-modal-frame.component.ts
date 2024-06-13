import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-user-modal-frame',
  templateUrl: './profile-user-modal-frame.component.html',
  styleUrls: ['./profile-user-modal-frame.component.scss']
})
export class ProfileUserModalFrameComponent {
  constructor(){}
  @Input() first_name:string = "";
  @Input() last_name:string = "";
  @Input() email:string = "";
  @Input() phone_number:string = "";
  @Input() rol_name:string = "";

  ngOnInit(){
    // this.firstName.setValue(this.first_name)
    // this.lastName.setValue(this.last_name)
  }

  logOut(){
    localStorage.removeItem('token-kanban365');
    window.location.reload()
  }
}
