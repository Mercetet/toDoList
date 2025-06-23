export interface ITask {
    _id?: string,
    titulo: string,
    descripcion: string,
    estado: string,
    fechaLimite:string
    tempId?: string
}