import axios from "axios";
import { ISprint } from "../types/ISprint";
import { ISprintList } from "../types/ISprintList";

export const putSprintList = async (sprint: ISprint[]) => {
	try {
		const API_URL_SPRINT = import.meta.env.VITE_SPRINT_API_URL as string;
		const response = await axios.put<ISprintList>(API_URL_SPRINT, {
			sprints: sprint,
		});
		return response.data;
	} catch (error) {
		console.error("Algo salio mal sprintListPut:", error);
	}
};
