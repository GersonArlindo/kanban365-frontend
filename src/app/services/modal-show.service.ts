import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalShowService {

  constructor() { }

  darkBackground = false;

  showTaskModal = false;
  showEditTaskModal = false;
  showCreateTaskModal = false;
  showDeleteTaskModal = false;

  showEditBoardModal = false;
  showDeleteBoardModal = false;
  showCreatedBoardModal = false;
  showViewProfileModal = false;
  showSettingsModal = false
  showViewProfileUserModal = false;


  showEditDeleteContainer = false;

  openTaskModal(){
    this.darkBackground = true;
    this.showTaskModal = true;
  }
  openEditTaskModal(){
    this.showTaskModal = false;
    this.showEditTaskModal = true;
  }
  openCreateTaskModal(){
    this.showTaskModal = false;
    this.darkBackground = true;
    this.showCreateTaskModal = true;
  }
  openDeleteTaskModal() {
    this.showTaskModal = false;
    this.darkBackground = true;
    this.showDeleteTaskModal = true;
  }
  openEditBoardModal(){
    this.darkBackground = true;
    this.showEditBoardModal = true;
  }

  openViewProfileModal(){
    this.darkBackground = true;
    this.showViewProfileModal = true;
  }

  openSettingsModal(){
    this.darkBackground = true;
    this.showSettingsModal = true;
  }

  openViewProfileUserModal(){
    this.darkBackground = true;
    this.showViewProfileUserModal = true;
  }

  openDeleteBoardModal(){
    this.darkBackground = true;
    this.showDeleteBoardModal = true;
  }
  
  openCreateBoardModal(){
    this.darkBackground = true;
    this.showCreatedBoardModal = true;
  }

  onEditDeleteContainerClick(){
    this.showEditDeleteContainer = !this.showEditDeleteContainer
  }

  closeEditDeleteContainer(){
    this.showEditDeleteContainer = false;
  }

  closeModal(){
    this.darkBackground = false;
    this.showTaskModal = false;
    this.showEditTaskModal = false;
    this.showCreateTaskModal = false;
    this.showDeleteBoardModal = false;
    this.showDeleteTaskModal = false;
    this.showCreatedBoardModal = false;
    this.showEditBoardModal = false;
    this.showViewProfileModal = false;
    this.showSettingsModal = false;
    this.showViewProfileUserModal = false;
  }
}
