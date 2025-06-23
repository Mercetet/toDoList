import { ITask } from "./ITask";

export interface ISprint {
    _id?: string,
    fechaInicio: string,
    fechaCierre: string,
    nombre: string,
    tareas: ITask[]
}