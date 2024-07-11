import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ColorThemeService } from '../services/color-theme.service';
import { SidebarToggleService } from '../services/sidebar-toggle.service';
import { BoardsService } from '../services/boards.service';
import { ModalShowService } from '../services/modal-show.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  implements AfterViewInit   {
  @Input() rol_name:string = "";
  constructor(
    public colorTheme: ColorThemeService, 
    public sidebarService:SidebarToggleService,
    public boardsService: BoardsService,
    public modalShowService: ModalShowService,
    ) {}

    ngAfterViewInit() {
      // Aquí puedes colocar cualquier código que dependa de la vista
    }



    openEditBoardModal(){
      this.modalShowService.openEditBoardModal();
      this.modalShowService.closeEditDeleteContainer();
    }

    openViewProfileModal(){
      if(this.rol_name == 'Admin'){
        this.modalShowService.openViewProfileModal();
      }else{
        this.modalShowService.openViewProfileUserModal();
      }
    }

    openSettingsModal(){
      this.modalShowService.openSettingsModal()
    }
    
    openDeleteBoardModal(){
      this.modalShowService.openDeleteBoardModal();
      this.modalShowService.closeEditDeleteContainer();
    }

    handleAddNewTask(){
      this.boardsService.currentTask.status = "";
      this.modalShowService.openCreateTaskModal();
    }

}
