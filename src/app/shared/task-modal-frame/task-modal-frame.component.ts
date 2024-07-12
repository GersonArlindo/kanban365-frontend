import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BoardsService } from 'src/app/services/boards.service';
import { ModalShowService } from 'src/app/services/modal-show.service';
import { FormControl, Validators } from "@angular/forms"
import { Column, Subtask } from 'src/app/types/boards.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task-modal-frame',
  templateUrl: './task-modal-frame.component.html',
  styleUrls: ['./task-modal-frame.component.scss']
})
export class TaskModalFrameComponent implements OnInit {

  constructor(
    public boardsService:BoardsService, 
    public modalShowService:ModalShowService,
    private UserSrv: AuthService
  ){}
  @Input() startDate: string = ""
  @Input() dueDate: string = ""
  @Input() durationText: string = ""
  @Input() modalName:string = "";
  @Input() titleValue:string = "";
  @Input() descriptionValue:string = "";
  @Input() subtasks:Array<Subtask> = [
    {title: "", isCompleted: false},
    {title: "", isCompleted: false}
  ];
  @Input() statusValues:Array<Column> = [];
  @Input() buttonName:string = "";

  @ViewChildren('templateSubtask') subtasksInputChildren!: QueryList<ElementRef<HTMLInputElement>>;
  users: any[] = []
  minDateTime!: string;
  //startDate: any
  //dueDate: any
  //durationText: string | undefined;
  opcionSeleccionadaUser: any[] = []
  name = new FormControl('', Validators.required);
  indexes = this.boardsService.indexes;
  subtaskPlaceholders = ["e.g. Make coffee", "e.g Drink coffee & smile", "e.g. Enjoy your caffeine boost", "e.g. Wash the cup"]


  removeSubtask(subtaskIndex:number,event:Event){
    event.preventDefault()
    this.subtasks.splice(subtaskIndex,1)
  }
  addNewSubtask(event:Event){
    event.preventDefault()
    this.subtasks.push({title:"",isCompleted:false})
  }
  
  saveTask(event:Event, title:string, description:string, status:string){
    event.preventDefault()
    const subtasksArray = this.subtasksInputChildren.toArray()

    if (this.name.status === "INVALID"){
      this.name.markAsDirty();
      return
    }
    //Change title
    this.boardsService.currentTask.title = title;
    this.boardsService.currentTask.description = description

    //Change subtasks
    for ( let i = 0; i < subtasksArray.length; i++){
      if (!this.subtasks[i] && subtasksArray[i].nativeElement.value) {
        this.subtasks.push({
          title: subtasksArray[i].nativeElement.value,
          isCompleted: false,
        })
      } else{
      this.subtasks[i].title = subtasksArray[i].nativeElement.value;
      }
    }
      this.boardsService.currentTask.subtasks = this.subtasks.filter(subtask => !!subtask.title);
        // Find the column based on the status value
      const currentColumn: any = this.boardsService.currentBoard.columns[this.indexes.columnIndex];
      const newColumn: any = this.boardsService.currentBoard.columns.find(column => column.name === status);

      if (newColumn && newColumn.id !== currentColumn.id) {
          // If status is different, move the task to the new column
          newColumn.tasks.unshift(this.boardsService.currentTask);
          currentColumn.tasks.splice(this.indexes.taskIndex, 1);
      }

      // Create the updated task object
      const updatedTask = {
          id: (this.boardsService.currentTask as any).id, // Ensure we have the task id
          title: title,
          description: description,
          status: status,
          startDate: this.startDate, 
          dueDate: this.dueDate, 
          durationText: this.durationText,
          columnId: newColumn ? newColumn.id : currentColumn.id, // Use the new column id if status changed, otherwise use current column id
          subtasks: this.subtasks.filter(subtask => !!subtask.title)
      };

      // Send the updated task object through the service
      this.boardsService.setBoards(this.boardsService.boards, updatedTask, 'Editando Task');
      this.modalShowService.closeModal();
  }

  createTask(event:Event, title:string, description:string, status:string){
    event.preventDefault()
    const subtasksArray = this.subtasksInputChildren.toArray()
    if (this.name.status === "INVALID"){
      this.name.markAsDirty();
      return
    }
    //Adding value to subtasks variable
    for ( let i = 0; i < subtasksArray.length; i++){
      if (!this.subtasks[i]){
        this.subtasks[i] = {title:"", isCompleted: false}
      }
      this.subtasks[i].title = subtasksArray[i].nativeElement.value;
    }

    // Find column after status value then create new task
    const column: any = this.boardsService.currentBoard.columns.find(column => column.name === status);
    if (column) {
        // Create new task object
        const newTask = {
            startDate: this.startDate,
            dueDate: this.dueDate,
            durationText: this.durationText,
            assignedTo: this.opcionSeleccionadaUser,
            title: title,
            description: description,
            status: status,
            columnId: column.id, // Include the column ID
            subtasks: this.subtasks.filter(subtask => !!subtask.title)
        };

        column.tasks.unshift(newTask);
        this.boardsService.setBoards(this.boardsService.boards, newTask, 'Creando Task');
    }

    this.modalShowService.closeModal();
}

  setMinDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  ngOnInit(){
    this.name.setValue(this.titleValue)
    this.getUsers()
    this.setMinDateTime();
  }


  getUsers(){
    this.UserSrv.getUsers()
      .subscribe((data: any) =>{
        this.users = data
        console.log(this.users)
        console.log(this.boardsService.assignedUsers)
        this.users = this.users.filter(user => 
          this.boardsService.assignedUsers.some(assignedUser => assignedUser.user_id == user.id)
        );
      })
  }

  getStartDateValue(event: any){
    this.startDate = event.target.value
    console.log(event.target.value)
    this.calcularDuration();
  }

  getDueDateValue(event: any){
    this.dueDate = event.target.value
    this.calcularDuration();
  }


  calcularDuration() {
    if (this.startDate && this.dueDate) {
      const start = new Date(this.startDate);
      const due = new Date(this.dueDate);
      const durationMinutes = (due.getTime() - start.getTime()) / 1000 / 60; // Duración en minutos
      this.durationText = this.formatDuration(durationMinutes);
      console.log('Duración:', this.durationText);
    }
  }

  formatDuration(durationMinutes: number): string {
    const minutesInDay = 1440;
    const minutesInHour = 60;

    const days = Math.floor(durationMinutes / minutesInDay);
    const hours = Math.floor((durationMinutes % minutesInDay) / minutesInHour);
    const minutes = Math.floor(durationMinutes % minutesInHour);

    let durationString = '';

    if (days > 0) {
      durationString += `${days} día${days > 1 ? 's' : ''} `;
    }
    if (hours > 0) {
      durationString += `${hours} hora${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      durationString += `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }

    return durationString.trim();
  }
  
  public doSelectOptions = (options: any) => {
    const selectedData = options.map((option: any) => option.data.id);
    console.log(selectedData);
    this.opcionSeleccionadaUser = selectedData; // Guarda los datos en un arreglo
  }
}
