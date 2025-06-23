
import { ISprint } from "../types/ISprint";
import { BacklogServices } from "../services/BacklogServices";
import { TaskServices } from "../services/TaskServices";
import { SprintServices } from "../services/SprintServices";

const backlogService = new BacklogServices();
const tasksService = new TaskServices();
const sprintService = new SprintServices();

export const getSprintsController = async (): Promise<ISprint[]> => {
	try {
		const response = await sprintService.getAllSprints();
		return response || [];
	} catch (error) {
		console.error("Error en getSprintsController:", error);
		return [];
	}
};

export const createSprintController = async (newSprint: ISprint) => {
	try {
		const response = await sprintService.addSprint(newSprint);
		console.log("Respuesta de createSprintController", response);
		return response;
	} catch (error) {
		console.error("Error en createSprintController:", error);
	}
};

export const updateSprintController = async (updatedSprint: ISprint) => {
	try {
		await sprintService.editSprint(updatedSprint._id as string, updatedSprint);
	} catch (error) {
		console.error("Error en updateSprintController:", error);
	}
};

export const deleteSprintController = async (idDeletedSprint: string) => {
	try {
		await sprintService.deleteSprint(idDeletedSprint);
	} catch (error) {
		console.error("Error en deleteSprintController:", error);
	}
};

export const addTaskToSprintController = async (sprintId: string, taskId: string) => {
	try {
		const response = await sprintService.addTaskToSprint(sprintId, taskId);
		console.log("Respuesta de addTaskToSprintController", response);
		return response;
	} catch (error) {
		console.error("Error en addTaskToSprintController:", error);
	}
};

