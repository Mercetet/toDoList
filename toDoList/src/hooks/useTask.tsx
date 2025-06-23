import { taskStore } from "../store/taskStore";
import { v4 as uuidv4 } from "uuid";
import {
	getTasksController,
	createTaskController,
	updateTaskController,
	deleteTaskController,
} from "../data/backlogController";
import { ITask } from "../types/ITask";
import { useShallow } from "zustand/shallow";
import Swal from "sweetalert2";
import { ISprint } from "../types/ISprint";

export const useTask = () => {
	const { tasks, setArrayTasks, addTask, updateTask, deleteTask, replaceTask } = taskStore(
		useShallow((state) => ({
			tasks: state.tasks,
			setArrayTasks: state.setArrayTasks,
			addTask: state.addTask,
			updateTask: state.updateTask,
			deleteTask: state.deleteTask,
			replaceTask: state.replaceTask,
		}))
	);

	const getTasks = async () => {
		const data = await getTasksController();
		if (data) {
			setArrayTasks(data);
		}
	};

	const addNewTask = async (newTask: ITask) => {
		const tempId = crypto.randomUUID();
		const tempTask = { ...newTask, _id: tempId, isTemp: true };
	
		// 1. Agregar tarea temporal
		addTask(tempTask);
	
		try {
			// 2. Crear en el backend y obtener la real con su _id
			const response = await createTaskController(newTask);
			if (response) {
				// 3. Reemplazar la temporal por la real
				replaceTask(tempId, response);
			}
		} catch (error) {
			deleteTask(tempId);
			console.error("Error en addNewTask:", error);
		}
	};
	

	const updateExistingTask = async (updatedTask: ITask) => {
		const idToMatch = updatedTask.tempId || updatedTask._id;

		const previousTask = tasks.find(
			(el) => el.tempId === idToMatch || el._id === idToMatch
		);

		if (previousTask) {
			const { tempId, ...cleanTask } = updatedTask;

			updateTask(cleanTask);

			try {
				await updateTaskController(cleanTask);
			} catch (error) {
				updateTask(previousTask);
				console.error("Error en updateExistingTask:", error);
			}
		}
	};

	const updateExistingTaskInSprint = async (updatedTask: ITask, sprint: ISprint) => {
		const idToMatch = updatedTask.tempId || updatedTask._id;
		const sprintTasks = sprint.tareas;
		const previousTask = sprintTasks.find(
			(el) => el.tempId === idToMatch || el._id === idToMatch
		);
		if (previousTask) {
			const { tempId, ...cleanTask } = updatedTask;

			const updatedSprint = {
				...sprint,
				tareas: sprint.tareas.map((task) =>
					task._id === previousTask._id ? { ...task, ...cleanTask } : task
				),
			};

			updateTask(cleanTask);

			try {
				await updateTaskController(cleanTask);
				return updatedSprint;
			} catch (error) {
				updateTask(previousTask);
				console.error("Error en updateExistingTask:", error);
			}
		}
	}

	const deleteExistingTask = async (idDeletedTask: string) => {
		const previousTask = tasks.find((task) => task._id === idDeletedTask);
		Swal.fire({
			title: "Estas seguro?",
			text: "No podra recuperarse!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			cancelButtonText: "Cancelar",
			confirmButtonText: "Eliminar!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				if (previousTask) {
					deleteTask(idDeletedTask);
					try {
						await deleteTaskController(idDeletedTask);
					} catch (error) {
						addTask(previousTask);
						console.error("Error en deleteExistingTask:", error);
					}
				}
				Swal.fire({
					title: "Eliminado!",
					text: "Tu tarea fue eliminada.",
					icon: "success",
				});
			}
		});
	};

	const deleteTaskWithoutConfirmation = async (idDeletedTask: string) => {
		const previousTask = tasks.find((task) => task._id === idDeletedTask);
		if (previousTask) {
			deleteTask(idDeletedTask);
			try {
				await deleteTaskController(idDeletedTask);
			} catch (error) {
				addTask(previousTask);
				console.error("Error en deleteExistingTask:", error);
			}
		}
	};

	return {
		tasks,
		getTasks,
		addNewTask,
		updateExistingTask,
		deleteExistingTask,
		deleteTaskWithoutConfirmation,
		updateExistingTaskInSprint,
	};
};
