import axios from "axios";
import { ITask } from "../types/ITask";
import { IBacklog } from "../types/IBacklog";

export const putBacklog = async (task: ITask[]) => {
	try {
		const API_URL = import.meta.env.VITE_BACKLOG_API_URL as string;
		const response = await axios.put<IBacklog>(API_URL, {
			tareas: task,
		});
		return response.data;
	} catch (error) {
		console.error("Algo salio mal backlogPut:", error);
	}
};
