import { Component } from '@angular/core';
import { ModalShowService } from '../services/modal-show.service';
import { BoardsService } from '../services/boards.service';
import { SidebarToggleService } from '../services/sidebar-toggle.service';

@Component({
  selector: 'app-confirm-delete-task',
  templateUrl: './confirm-delete-task.component.html',
  styleUrls: ['./confirm-delete-task.component.scss']
})
export class ConfirmDeleteTaskComponent {
  constructor(
    public modalShowService:ModalShowService,
    public boardsService:BoardsService,
    public sidebarService: SidebarToggleService
    ) {}

  indexes = this.boardsService.indexes;

  deleteTask(){
    // Obtener el ID de la tarea que se va a eliminar
    const taskId = this.boardsService.currentBoard.columns[this.indexes.columnIndex].tasks[this.indexes.taskIndex];
    // Eliminar la tarea del arreglo de tareas en la columna actual
    this.boardsService.currentBoard.columns[this.indexes.columnIndex].tasks.splice(this.indexes.taskIndex, 1);
    // Llamar al método setBoards con el ID de la tarea eliminada
    this.boardsService.setBoards(this.boardsService.boards, taskId, 'Delete Task');
    // Cerrar el modal
    this.modalShowService.closeModal();
  }
  
  cancelDelete(){
    this.modalShowService.closeModal()
  }
}
