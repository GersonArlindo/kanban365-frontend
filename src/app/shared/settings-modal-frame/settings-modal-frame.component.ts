import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BoardsService } from 'src/app/services/boards.service';
import { GhlApiKeyService } from 'src/app/services/ghl-api-key.service';
import { ModalShowService } from 'src/app/services/modal-show.service';
import { SidebarToggleService } from 'src/app/services/sidebar-toggle.service';
import { TriggersFunctionService } from 'src/app/services/triggers-function.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings-modal-frame',
  templateUrl: './settings-modal-frame.component.html',
  styleUrls: ['./settings-modal-frame.component.scss']
})

export class SettingsModalFrameComponent implements OnInit {
[x: string]: any;
  @Input() ghlApiKeys!: any[]
  @Input() currentGhlApiKey!: any
  @Input() first_name:string = "";
  @Input() last_name:string = "";
  // @ViewChild('dt') table!: Table;
  id = new FormControl('')
  name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  apiKey = new FormControl('', [Validators.required] )
  locationId = new FormControl('', [Validators.required])
  trigger_link = new FormControl('', [Validators.required])
  ButtonTitle: boolean =  false
  users: any[] = []
  triggerFunctions: any[] = []
  selectedTriggers: any[] = []
  searchText: string = '';
  page: number = 1;

  associatedTriggersFunctions: any[] = []

  constructor(
    public boardsService:BoardsService,
    public modalShowService:ModalShowService,
    public sidebarService:SidebarToggleService,
    public ghlApiKeyService: GhlApiKeyService,
    public UserService: AuthService,
    public TriggerFunctionService: TriggersFunctionService
    ){}
  
  ngOnInit(){
    this.getUsers()
    this.getTriggerFunctions()
  }

  getTriggerFunctions(){
    this.TriggerFunctionService.getTriggersFunctions()  
    .subscribe((data:any)=>{
      this.triggerFunctions = data
    })
  }

  getUsers(){
    this.UserService.getUsers()
      .subscribe((res:any)=>{
        this.users = res
        console.log(this.users)
      })
  }

  createApiKey(event:Event){
    //event.preventDefault()
    if (this.name.status === "INVALID" || this.apiKey.status === "INVALID" || this.locationId.status === "INVALID"){
      this.name.markAsDirty();
      return
    }
    const apiKeyData = {
      name: this.name.value || "",
      api_key: this.apiKey.value || "",
      location_id: this.locationId.value || "",
      created_by: this.first_name + ' ' + this.last_name
    }
    this.ghlApiKeyService.addGHLApiKey(apiKeyData)
      .subscribe((res: any) => {
        if(res.msj == "Created"){
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
            title: "Api Key successfully added"
          });
          this.ghlApiKeyService.getGHLApiKey()
          this.clearValuesForm()
        }else{
          alert("Oops, something went wrong")
          this.clearValuesForm()
        }
      })
  }

  createTriggerLink(event: any) {
    if (this.trigger_link.status === 'INVALID') {
      this.trigger_link.markAsDirty();
      return;
    }
    if (this.selectedTriggers.length <= 0) {
      alert('Please select at least one trigger');
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedTriggerIds = this.selectedTriggers.map(trigger => trigger.id);
        const observables = selectedTriggerIds.map(element => {
          const data = {
            trigger_id: element,
            trigger_link: this.trigger_link.value || '',
            status: 1,
          };
          return this.TriggerFunctionService.addAssociatedTriggersFunctions(data);
        });

        // Usar forkJoin para esperar a que todas las solicitudes terminen
        forkJoin(observables).subscribe(
          (responses: any[]) => {
            responses.forEach(res => {
              if (res && res.msj === 'Created') {
                // Aquí puedes lanzar tu toast
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
                  title: "Correctly associated links"
                });
                this.triggerFunctionsSelectedHandler()
              }else{
                alert('There was a problem creating the associated triggers');
              }
            });
          },
          error => {
            console.error('Error al crear triggers asociados', error);
            // Aquí podrías mostrar un toast de error si lo deseas
          alert('There was a problem creating the associated triggers');
          }
        );
      }
    });

    

  }


  editGhlApiKey(api: any){
    this.ButtonTitle = true
    console.log(api)
    this.id.setValue(api.id)
    this.name.setValue(api.name)
    this.apiKey.setValue(api.api_key)
    this.locationId.setValue(api.location_id)

  }

  saveChangesEditApiKey(){
    const apiKeyId = this.id.value
    if(!apiKeyId){
      return
    }
    const apiKeyData = {
      name: this.name.value || "",
      api_key: this.apiKey.value || "",
      location_id: this.locationId.value || "",
      created_by: this.first_name + ' ' + this.last_name
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.ghlApiKeyService.editGHLApiKey(apiKeyData, apiKeyId)
          .subscribe((res: any) =>{
            if(res.msj == "Updated"){
              Swal.fire({
                title: "Updated!",
                text: "Your record has been updated.",
                icon: "success"
              });
              this.ghlApiKeyService.getGHLApiKey()
            }else{
              alert("Oops, something went wrong")
              this.clearValuesForm()
            }
          })
      }
    });
    this.clearValuesForm()
  }

  clearValuesForm(){
    this.id.setValue("")
    this.name.setValue("")
    this.apiKey.setValue("")
    this.locationId.setValue("")
    this.ButtonTitle = false
  }

  truncateString(str: any, num: any) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }

  copyToClipboard(value: string): void {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
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
      title: "Text copied to clipboard"
    });
  }

  get filteredUsers() {
    if (!this.searchText) {
      return this.users;
    }
    return this.users.filter(user => 
      user.first_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.last_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.phone_number.includes(this.searchText) ||
      (user.rol_id == 1 ? "Admin" : "User").toLowerCase().includes(this.searchText.toLowerCase()) ||
      (user.status == 1 ? "Active" : "Inactive").toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  handleDeactivateUser(id: any){
    const data: any = {
      "not-value": 0
    }
    this.UserService.deactivateUser(data, id)
      .subscribe((res: any) =>{
        if(res.msj && res.msj == "User deactivated"){
          this.getUsers()
        }else{
          alert("Oops, an error occurred")
        }
      })
  }

  handleActivateUser(id: any){
    const data: any = {
      "not-value": 0
    }
    this.UserService.activateUser(data, id)
      .subscribe((res: any) =>{
        if(res.msj && res.msj == "User activated"){
          this.getUsers()
        }else{
          alert("Oops, an error occurred")
        }
      })
  }

  handleUpdateUser(user: any){
    this.UserService.setUserToEdit(user)
  }

  triggerFunctionsSelectedHandler() {
    setTimeout(() => {
      const selectedTriggerIds = this.selectedTriggers.map(trigger => trigger.id);
      const payload = { ids: selectedTriggerIds };
      this.TriggerFunctionService.getAssociatedTriggersFunctionsByArrayTriggerId(payload)
        .subscribe((data: any) => {
          this.associatedTriggersFunctions = data;
          console.log(this.associatedTriggersFunctions);
        });
    });
  }

  eliminarWorkFlowAsociate(id: any){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.TriggerFunctionService.deleteAssociatedTriggersFunctions(id)
        .subscribe((res: any) => {
          if(res && res.msj == 'Deleted'){
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
              title: "Deleted Successfully"
            });
            this.triggerFunctionsSelectedHandler()
          }else{
            alert("oops, an error occurred")
          }
        })
      }
    });
  }

}
