
import { ITask } from "../types/ITask";
import { BacklogServices } from "../services/BacklogServices";
import { TaskServices } from "../services/TaskServices";


const BacklogService = new BacklogServices();
const TasksService = new TaskServices();

export const getAndCreateBacklog = async () => {
	try {
		await BacklogService.addBacklogService([]); 
		const response = await BacklogService.getBacklogService(); 
		return response;
	} catch (error) {
		console.error("Error en getAndCreateBacklog:", error);
		return null;
	}
};

export const getTasksController = async (): Promise<ITask[]> => {
	try {
		const tasks = await BacklogService.getAllTasksInBacklogService();
		return tasks || [];
	} catch (error) {
		console.error("Error en getTasksController:", error);
		return [];
	}
};

export const createTaskController = async (newTask: ITask): Promise<ITask> => {
	try {
		const response = await TasksService.addTask(newTask);
		if (!response || !response._id) {
			throw new Error("Respuesta inválida al crear tarea");
		}
		return response;
	} catch (error) {
		console.error("Error en createTaskController:", error);
		throw error;
	}
};



export const updateTaskController = async (updatedTask: ITask) => {
	try {
		await TasksService.editTask(updatedTask._id as string, updatedTask); 
	} catch (error) {
		console.error("Error en updateTaskController:", error);
	}
};

export const deleteTaskController = async (idDeletedTask: string) => {
	try {
		await BacklogService.deleteTaskInBacklogService(idDeletedTask); 
	} catch (error) {
		console.error("Error en deleteTaskController:", error);
	}
};