import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BoardsService } from 'src/app/services/boards.service';
import { GhlApiKeyService } from 'src/app/services/ghl-api-key.service';
import { ModalShowService } from 'src/app/services/modal-show.service';
import { SidebarToggleService } from 'src/app/services/sidebar-toggle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-settings-modal-frame',
  templateUrl: './settings-modal-frame.component.html',
  styleUrls: ['./settings-modal-frame.component.scss']
})
export class SettingsModalFrameComponent implements OnInit {
  @Input() ghlApiKeys!: any[]
  @Input() currentGhlApiKey!: any
  @Input() first_name:string = "";
  @Input() last_name:string = "";
  id = new FormControl('')
  name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  apiKey = new FormControl('', [Validators.required] )
  locationId = new FormControl('', [Validators.required])
  ButtonTitle: boolean =  false

  constructor(
    public boardsService:BoardsService,
    public modalShowService:ModalShowService,
    public sidebarService:SidebarToggleService,
    public ghlApiKeyService: GhlApiKeyService
    ){}
  
  ngOnInit(){
    
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
}