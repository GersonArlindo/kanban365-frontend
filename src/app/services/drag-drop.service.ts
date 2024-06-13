import { Injectable } from '@angular/core';
import { BoardsService } from './boards.service';
import { Task } from '../types/boards.interface';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  constructor(public boardsService:BoardsService) { }

    // Drag & Drop
    public dragging: Task | undefined;

    dragStart(e:DragEvent, item:Task){
      this.dragging = item;
    }
  
    dragEnd(e:DragEvent, item: Task){
      this.dragging = undefined;
    }
  
    dragOver(e:DragEvent){
      if(this.dragging){
        e.preventDefault()
      }
    }
  
    drop(e:DragEvent){
      e.preventDefault();
      const currentTaskIndex = this.boardsService.indexes.taskIndex;
      const currentColumnIndex = this.boardsService.indexes.columnIndex;
      const dropColumnIndex = this.boardsService.indexes.dropColumnIndex;
      const dropTaskIndex = this.boardsService.indexes.dropTaskIndex;
      // Eliminar la tarea de la columna actual
      const task: any = this.boardsService.currentBoard.columns[currentColumnIndex].tasks.splice(currentTaskIndex, 1)[0];
      // Actualizar el estado (nombre de la columna) y el id de la columna de destino
      if (task) {
        task.status = this.boardsService.currentBoard.columns[dropColumnIndex].name;
        const newColumnId = this.boardsService.currentBoard.columns[dropColumnIndex];
        // Añadir la tarea a la nueva columna en la posición especificada
        this.boardsService.currentBoard.columns[dropColumnIndex].tasks.splice(dropTaskIndex, 0, task);
    
        const data: any = {
          id: task.id,
          status: task.status,
          columnId: newColumnId
        }
    
        // Actualizar la UI
        this.dragging = undefined;
        this.boardsService.setBoards(this.boardsService.boards, data, 'Moviendo Task');
    }
  }
}
