import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BoardsService } from 'src/app/services/boards.service';
import { ModalShowService } from 'src/app/services/modal-show.service';
import { FormControl, Validators } from "@angular/forms"
import { Column } from 'src/app/types/boards.interface';
import { SidebarToggleService } from 'src/app/services/sidebar-toggle.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-board-modal-frame',
  templateUrl: './board-modal-frame.component.html',
  styleUrls: ['./board-modal-frame.component.scss']
})
export class BoardModalFrameComponent implements OnInit {
  opcionSeleccionadaUser: any[] = []
  users: any[] = []
  constructor(
    public boardsService:BoardsService,
    public modalShowService:ModalShowService,
    public sidebarService:SidebarToggleService,
    private UserSrv: AuthService,
    private cdr: ChangeDetectorRef
    ){}

  @Input() modalName:string = "";
  @Input() titleValue:string = "";
  @Input() descriptionValue:string = "";
  @Input() columns:Array<Column> = [
    {
    name: "",
    tasks: []
    },
    {
    name: "",
    tasks: []
    }
  ];
  @Input() statusValues:string[] = [];
  @Input() buttonName:string = "";

  @ViewChildren('templateColumn') columnChildren!: QueryList<ElementRef<HTMLInputElement>>;

  name = new FormControl('', [Validators.required, Validators.maxLength(21)]);
  indexes = this.boardsService.indexes;
  columnsCopy!: Array<Column>;
  columnPlaceholders = ["e.g Todo", "e.g Doing", "e.g Done", "e.g Now", "e.g Next", "e.g Later"]

  removeColumn(columnIndex:number,event:Event){
    event.preventDefault()
    this.columnsCopy.splice(columnIndex,1)
  }
  addNewColumn(event:Event){
    event.preventDefault()
    this.columnsCopy.push({
      name:"",
      tasks:[]
    })
  }
  
  saveBoard(event:Event){
    event.preventDefault()
    const columnArray = this.columnChildren.toArray();
    if (this.name.status === "INVALID"){
      this.name.markAsDirty();
      return
    }
    //Change title
    this.boardsService.currentBoard.name = this.name.value || "";

    this.boardsService.currentBoard.columns = this.columnsCopy;

    for ( let i = 0; i < columnArray.length; i++){
      if (!this.boardsService.currentBoard.columns[i] && columnArray[i].nativeElement.value ){
        this.boardsService.currentBoard.columns.push({
          name: columnArray[i].nativeElement.value,
          tasks: []
        })
      }
      this.boardsService.currentBoard.columns[i].name = columnArray[i].nativeElement.value
    }

    this.boardsService.currentBoard.columns = this.boardsService.currentBoard.columns.filter(column => !!column.name)
    this.boardsService.setBoards(this.boardsService.boards, this.boardsService.currentBoard, 'Editando Board');
    this.modalShowService.closeModal();
  }

  createBoard(event:Event){
    event.preventDefault()
    const columnArray = this.columnChildren.toArray();
    if (this.name.status === "INVALID"){
      this.name.markAsDirty();
      return
    }
    // Crear el nuevo tablero con columnas vacías
    const newBoard = {
        assignedTo: this.opcionSeleccionadaUser,
        columns: [],
        name: this.name.value || ""
    };
    // Agregar el nuevo tablero al inicio del array de tableros
    this.boardsService.boards.boards.unshift(newBoard);
    // this.boardsService.boards.boards.unshift({
    //   columns: [],
    //   name: this.name.value || ""
    // })
    // Establecer el nuevo tablero como el tablero actual
    this.boardsService.currentBoard = newBoard;
    for ( let i = 0; i < columnArray.length; i++){
      if (!columnArray[i].nativeElement.value){
        continue
      }
      this.boardsService.currentBoard.columns.push({
        name: columnArray[i].nativeElement.value,
        tasks: []
      })
    }
    this.sidebarService.selectedIndex = 0;
    this.boardsService.setBoards(this.boardsService.boards, newBoard, 'Add Board')
    this.modalShowService.closeModal();
  }

  getUsers(){
    this.UserSrv.getUsers()
      .subscribe((data: any) =>{
        this.users = data
        console.log(this.users)
      })
  }


  ngOnInit(){
    this.name.setValue(this.titleValue)
    this.columnsCopy = this.columns.map((column: Column) => column)
    this.getUsers()
  }


  public doSelectOptions = (options: any) => {
    const selectedData = options.map((option: any) => option.data.id);
    console.log(selectedData);
    this.opcionSeleccionadaUser = selectedData; // Guarda los datos en un arreglo
  }

}