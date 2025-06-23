import axios from "axios";

import { BackendClient } from "./BackendClient";
import { ITask } from "../types/ITask";

export class TaskServices extends BackendClient {
	constructor() {
		super("task");
	}

	async getAllTasks(): Promise<ITask[]> {
		const response = await axios.get(`${this.baseUrl}/`);
		return response.data;
	}

	async getTaskById(id: string): Promise<ITask> {
		const response = await axios.get(`${this.baseUrl}/taskbyid?id=${id}`);
		return response.data;
	}

	async getTasksByEstado(estado: string): Promise<ITask[]> {
		const response = await axios.get(
			`${this.baseUrl}/taskbyestado?estado=${estado}`
		);
		return response.data;
	}

	async getTasksByFecha(): Promise<ITask[]> {
		const response = await axios.get(`${this.baseUrl}/tasksdate`);
		return response.data;
	}

	async addTask(task: Omit<ITask, "_id">): Promise<ITask> {
		const response = await axios.post(`${this.baseUrl}/addtask`, task);
		return response.data.task; 
	  }

	async editTask(id: string, updates: Partial<ITask>): Promise<ITask> {
		const response = await axios.put(
			`${this.baseUrl}/edittask?id=${id}`,
			updates
		);
		return response.data;
	}

	async deleteTask(id: string): Promise<void> {
		await axios.delete(`${this.baseUrl}/deletetask?id=${id}`);
	}
}
