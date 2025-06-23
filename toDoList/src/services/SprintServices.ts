import axios from "axios";
import { BackendClient } from "./BackendClient";
import { ISprint } from "../types/ISprint";

export class SprintServices extends BackendClient {
  constructor() {
    super("sprint");
  }

  async getAllSprints(): Promise<ISprint[]> {
    const response = await axios.get(`${this.baseUrl}/`);
    return response.data;
  }

  async getSprintById(id: string): Promise<ISprint> {
    const response = await axios.get(`${this.baseUrl}/sprintbyid?id=${id}`);
    return response.data;
  }

  async addSprint(sprint: Omit<ISprint, "_id">): Promise<ISprint> {
    const response = await axios.post(`${this.baseUrl}/addsprint`, sprint);
    return response.data;
  }

  async editSprint(id: string, updates: Partial<ISprint>): Promise<ISprint> {
    const response = await axios.put(`${this.baseUrl}/editsprint?id=${id}`, updates);
    return response.data;
  }

  async addTaskToSprint(sprintId: string, taskId: string): Promise<ISprint> {
    const response = await axios.put(`${this.baseUrl}/sprints/addtask?id=${sprintId}&taskId=${taskId}`);
    return response.data;
  }

  async deleteSprint(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/deletesprint?id=${id}`);
  }

  async tasksBySprint(sprintId: string): Promise<{ message: string; sprint: ISprint }> {
    const response = await axios.get(`${this.baseUrl}/taskbysprintid?sprintId=${sprintId}`);
    return response.data;
  }
  
}
