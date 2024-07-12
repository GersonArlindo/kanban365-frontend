
export interface Boards{
    boards: Array<Board>
}

export interface Board{
    columns: Array<Column>
    name: string
}

export interface Column{
    name: string
    tasks: Array<Task>
}

export interface Task{
    id: string
    startDate: string
    dueDate: string
    durationText: string
    description: string
    status: string
    subtasks: Array<Subtask>
    assignedUsers: Array<any>
    title: string
}

export interface Subtask{
    isCompleted: boolean
    title: string
}