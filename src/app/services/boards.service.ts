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
  ) {
    this.initializeUserId();
   }
  token: any
  boards!: Boards;
  currentBoard!: Board
  isMyBoard: boolean = false
  user_id: string | null = null;
  assignedUsers: any[] = []
  currentTask: Task = {
    id: "string",
    startDate: "string",
    dueDate: "string",
    durationText: "string",
    description: "string",
    status: "string",
    subtasks: [],
    assignedUsers: [],
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

          //En este caso se verifica si el index del board en cuestion es igual al ultimo agregado, 
          //de no ser asi se toma el index guardado previamente en this.indexes.boardIndex para poder setear ese valor luego de traer nuevamente los boards
        case 'allOtherAction': 
          if(this.sidebarService.selectedIndex == lastInsert){
            this.sidebarService.selectedIndex = lastInsert;
            this.setCurrentBoard(this.boards.boards[lastInsert]);
            this.indexes.boardIndex = lastInsert;
          }else{
            this.sidebarService.selectedIndex = this.indexes.boardIndex;
            this.setCurrentBoard(this.boards.boards[this.indexes.boardIndex]);
            this.indexes.boardIndex = this.indexes.boardIndex;
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
    const response: any = await this.http.get(`${environment.API_URL}board/assignedUsers/${board_id.id}`).toPromise();
    this.assignedUsers = response.assignedUsers
    console.log(this.assignedUsers)
    this.isMyBoard = this.assignedUsers.some(user => user.user_id == this.user_id && user.owner == 1);
    console.log(this.isMyBoard)
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

  //*Recuperacion del id de usuario mediante el token
  async getUserInfo(inf: string): Promise<any> {
    this.token = await this.getTokens();
    let payload;
    if (this.token) {
      payload = this.token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload)[`${inf}`];
    } else {
      return null;
    }
  }

  getTokens(): Promise<string | null> {
    return new Promise((resolve) => {
      const checkToken = () => {
        const token = localStorage.getItem("token-kanban365");
        if (token) {
          resolve(token);
        } else {
          setTimeout(checkToken, 100); // Volver a comprobar después de 100ms
        }
      };
      checkToken();
    });
  }

  async initializeUserId() {
    this.user_id = await this.getUserInfo('id');
  }
}
