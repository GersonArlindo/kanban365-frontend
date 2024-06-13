import { Component } from '@angular/core';
import { ModalShowService } from '../services/modal-show.service';
import { BoardsService } from '../services/boards.service';
import { SidebarToggleService } from '../services/sidebar-toggle.service';

@Component({
  selector: 'app-confirm-delete-board',
  templateUrl: './confirm-delete-board.component.html',
  styleUrls: ['./confirm-delete-board.component.scss']
})
export class ConfirmDeleteBoardComponent {
  constructor(
    public modalShowService:ModalShowService,
    public boardsService:BoardsService,
    public sidebarService: SidebarToggleService
    ) {}

  indexes = this.boardsService.indexes;

  deleteBoard(){
    // Captura el ID del tablero que se va a eliminar
    const boardIdToDelete = this.boardsService.boards.boards[this.indexes.boardIndex];

    this.boardsService.boards.boards.splice(this.indexes.boardIndex,1)
    this.boardsService.currentBoard = this.boardsService.boards.boards[0]
    this.boardsService.indexes.boardIndex = 0;
    this.sidebarService.selectedIndex = 0;
    this.boardsService.setBoards(this.boardsService.boards, boardIdToDelete, 'Delete Board');
    this.modalShowService.closeModal();
  }
  cancelDelete(){
    this.modalShowService.closeModal()
  }
}
