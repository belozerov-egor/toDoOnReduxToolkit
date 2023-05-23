import axios from "axios";


const instance = axios.create({
        baseURL: 'https://social-network.samuraijs.com/api/1.1/',
        withCredentials: true,
        headers: {
            "API-KEY": 'bb36931e-ec0c-4605-9b68-f20125e9ce40',

        },

    }
)

export const todosApi = {
    getTodos(){
        return instance.get<TodolistApiType[]>('todo-lists')
    },
    addTodos(title: string){
      return instance.post('todo-lists', {title})
    },
    deleteTodo(todolistId: string){
        return instance.delete(`todo-lists/${todolistId}`)
    },
    changeTitle(todolistId: string, title: string){
        return instance.put(`todo-lists/${todolistId}`, {title})
    }

}

export const taskApi = {
    getTasks(todolistId: string){
        return instance.get<GetTasks>(`todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string){
        return instance.post(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string){
        return instance.delete(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    changeTask(todolistId: string, taskId: string, updateTask : UpdateTaskApiType){
        return instance.put(`todo-lists/${todolistId}/tasks/${taskId}`, {...updateTask })
    }
}

export type TodolistApiType = {
    id: string
    title: string
    order: number
    addedDate: string
}

export type GetTasks   = {
    error: string | null
    totalCount: number
    items: TasksTypeApi[]
}

export type TasksTypeApi = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: any
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type UpdateTaskApiType = {
    title: string | null
    description: string | null
    status: number | null
    priority: number | null
    startDate: string | null
    deadline: string | null
}