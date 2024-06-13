import { Component } from '@angular/core';
import { BoardsService } from '../services/boards.service';
import { Subtask } from '../types/boards.interface';
import { ModalShowService } from '../services/modal-show.service';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent {


  constructor(
    public boardsService: BoardsService,
    public modalShowService: ModalShowService
    ) {}

  indexes = this.boardsService.indexes;
  showEditDeleteContainer = false;

  openEditDeleteContainer(){
    this.showEditDeleteContainer = !this.showEditDeleteContainer;
  }

  handleCheckboxClick(i: number) {
    // Obtener el valor actual de isCompleted y el id de la subtarea
    const subtask: any = this.boardsService.currentTask.subtasks[i];
    const updatedSubtask = {
        id: subtask.id,
        isCompleted: !subtask.isCompleted
    };
    // Actualizar el valor de isCompleted en el front-end
    this.boardsService.currentTask.subtasks[i].isCompleted = updatedSubtask.isCompleted;
    // Actualizar el estado del board
    this.boardsService.setBoards(this.boardsService.boards, updatedSubtask, 'is Completed');
}

  changeStatus(value: string) {
    // Encuentra la columna actual de la tarea
    const currentColumn = this.boardsService.currentBoard.columns[this.indexes.columnIndex];

    // Encuentra la tarea actual
    const task: any = currentColumn.tasks[this.indexes.taskIndex];

    // Encuentra la nueva columna basada en el valor del estado
    const newColumn: any = this.boardsService.currentBoard.columns.find(column => column.name === value);

    if (newColumn) {
        // Actualiza el estado de la tarea
        task.status = value;
        // Añadir la tarea a la nueva columna
        newColumn.tasks.unshift(task);
        // Eliminar la tarea de la columna actual
        currentColumn.tasks.splice(this.indexes.taskIndex, 1);
        // Crear objeto con la información de la tarea, estado y columna
        const taskUpdateInfo = {
            taskId: task.id,
            status: value,
            columnId: newColumn.id
        };
        // Aquí puedes utilizar `taskUpdateInfo` para enviar los datos al backend
        this.boardsService.setBoards(this.boardsService.boards, taskUpdateInfo, 'Change Status');
        // Cerrar el modal
        this.modalShowService.closeModal();
    } else {
        console.error("New column not found");
    }
  }

  openDeleteTaskModal(){
    this.modalShowService.openDeleteTaskModal()
  }


  filterCompletedTasks(subtasks: Array<Subtask>):number{
    return subtasks.filter(subtask => subtask.isCompleted === true).length
  }
}


