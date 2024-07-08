import { Injectable } from '@angular/core';
import { Board, Boards, Task } from '../types/boards.interface';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SidebarToggleService } from './sidebar-toggle.service';
import { HandlerErrorService } from './handler-error.service';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  constructor(
    private http: HttpClient,
    private router: Router,
    public sidebarService: SidebarToggleService,
    private HandlerErrorSrv: HandlerErrorService
  ) { }

  boards!: Boards;
  currentBoard!: Board
  assignedUsers: any[] = []
  currentTask: Task = {
    description: "string",
    status: "string",
    subtasks: [],
    title: "string",
  }
  indexes = {
    boardIndex: 0,
    columnIndex: 0,
    taskIndex: 0,
    subtaskIndex: 0,
    dropColumnIndex: 0,
    dropTaskIndex: 0
  }
  async getBoards(value: any) {
    try {
      const response: any = await this.http.get(`${environment.API_URL}boards`).toPromise();
      this.boards = response;
      localStorage.setItem("boards", JSON.stringify(this.boards));
      console.log(response.boards.length - 1);
      const lastInsert = response.boards.length - 1;
      switch (value) {
        case 'AddBoard':
          this.sidebarService.selectedIndex = lastInsert;
          this.setCurrentBoard(this.boards.boards[lastInsert]);
          this.indexes.boardIndex = lastInsert;
          break;
        
        case 'onInit':
          this.sidebarService.selectedIndex = 0;
          this.setCurrentBoard(this.boards.boards[0]);
          this.indexes.boardIndex = 0;
          break;

        case 'allOtherAction':
          if(this.sidebarService.selectedIndex == lastInsert){
            this.sidebarService.selectedIndex = lastInsert;
            this.setCurrentBoard(this.boards.boards[lastInsert]);
            this.indexes.boardIndex = lastInsert;
          }

          break;
      
        default:
          // Puedes manejar otros casos aquí si es necesario
          break;
      }
      console.log(this.boards);
    } catch (error) {
      console.error('Error fetching boards:', error);
      // Puedes manejar el error de manera específica aquí, por ejemplo mostrar un mensaje al usuario
      // o lanzar un error específico para que se maneje en un nivel superior.
      throw error; // Lanza el error para que se maneje donde se llame a getBoards()
    }
  }

  setBoards(boards: Boards, data: any, accion: any) {
    switch (accion) {
      case 'Add Board':
        this.http.post(`${environment.API_URL}board/add`, data)
          .subscribe((response: any) => {
            console.log(response)
            this.getBoards("AddBoard")
          });
        break;
      case 'Editando Board':
        this.http.put(`${environment.API_URL}board/edit/${data.id}`, data)
          .subscribe((response: any) => {
            console.log(response)
            this.getBoards("allOtherAction")
          });
        break;
      case 'Delete Board':
        console.log(data)
        this.http.delete(`${environment.API_URL}board/delete/${data.id}`)
          .subscribe((response: any) => {
            console.log(response)
            this.getBoards("allOtherAction")
          });
        break;
      case 'Creando Task':
        console.log(data)
        this.http.post(`${environment.API_URL}task/add`, data)
          .subscribe((response: any) => {
            console.log(response)
            this.getBoards("allOtherAction")
          });
        break
      case 'Editando Task':
        this.http.put(`${environment.API_URL}task/edit/${data.id}`, data)
        .subscribe((response: any) => {
          console.log(response)
          this.getBoards("allOtherAction")
        });
        break
      case 'Change Status':
        this.http.put(`${environment.API_URL}task/change-status/${data.taskId}`, data)
        .subscribe((response: any) => {
          console.log(response)
          this.getBoards("allOtherAction")
        });
        break
      case 'is Completed':
        this.http.put(`${environment.API_URL}subtask/toggle-completion/${data.id}`, data)
        .subscribe((response: any) => {
          console.log(response)
          this.getBoards("allOtherAction")
        });
        break
      case 'Delete Task':
        this.http.delete(`${environment.API_URL}task/delete/${data.id}`)
          .subscribe((response: any) => {
            console.log(response)
            this.getBoards("allOtherAction")
          });
        break
      case 'Moviendo Task':
        const dataMov = {
          status: data.status,
          columnId: data?.columnId?.id
        }
        this.http.put(`${environment.API_URL}task/change-status/${data.id}`, dataMov)
          .subscribe((response: any) => {
            console.log(response)
            this.getBoards("allOtherAction")
          });
        break
      default:
        break;
    }
    console.log(data)
    console.log(accion)
    //localStorage.setItem("boards", JSON.stringify(boards))
  }

  async getAssignedUsers(board_id: any){
    console.log(board_id)
    const response: any = await this.http.get(`${environment.API_URL}board/assignedUsers/${board_id.id}`).toPromise();
    this.assignedUsers = response.assignedUsers
  } 

  setCurrentBoard(board: Board) {
    console.log(board)
    this.currentBoard = board;
    this.getAssignedUsers(this.currentBoard)
  }


  setCurrentTask(task: Task) {
    console.log(task)
    this.currentTask = task;
  }
}
