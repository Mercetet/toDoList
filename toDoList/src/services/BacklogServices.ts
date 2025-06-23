import axios from "axios";
import { BackendClient } from "./BackendClient";
import { IBacklog } from "../types/IBacklog";
import { ITask } from "../types/ITask";


export class BacklogServices extends BackendClient {
  constructor() {
    super("backlog");
  }

  async getBacklogService(): Promise<IBacklog[]> {
    const response = await axios.get(`${this.baseUrl}/`);
    return response.data;
  }

  async addBacklogService(tareas: string[]): Promise<IBacklog> {
    const response = await axios.post(`${this.baseUrl}/addbacklog`, { tareas });
    return response.data;
  }

  async addTaskToBacklogService(taskId: string): Promise<IBacklog> {
    const response = await axios.put(`${this.baseUrl}/taskinbacklog/addtask?taskId=${taskId}`);
    return response.data;
  }

  async getAllTasksInBacklogService(): Promise<ITask[]> {
    const response = await axios.get(`${this.baseUrl}/getalltasksfrombacklog`);
    console.log("Respuesta de getAllTasksInBacklogService", response.data);
    return response.data.tasks.tareas || [];
  }

  async deleteTaskInBacklogService(taskId: string): Promise<IBacklog> {
    const response = await axios.delete(`${this.baseUrl}/deletetaskfrombacklog?id=${taskId}`);
    return response.data;
  }
}
