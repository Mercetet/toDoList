import { create } from "zustand";
import { ITask } from "../types/ITask";

interface ITaskStore {
	tasks: ITask[];
	setArrayTasks: (tasks: ITask[]) => void;
	activeTask: ITask | null;
	setActiveTask: (task: ITask | null) => void;
	addTask: (task: ITask) => void;
	updateTask: (task: ITask) => void;
	deleteTask: (taskId: string) => void;
	replaceTask: (tempId: string, realTask: ITask) => void;
}

export const taskStore = create<ITaskStore>((set) => ({
	tasks: [],
	activeTask: null,
	setArrayTasks: (tasksArray) => set(() => ({ tasks: tasksArray })),
	setActiveTask: (activeTaskIn) => set(() => ({ activeTask: activeTaskIn })),
	addTask: (newTask) => set((state) => ({ tasks: [...state.tasks, newTask] })),
	replaceTask: (tempId, realTask) =>
		set((state) => ({
			tasks: state.tasks.map((task) =>
				task._id === tempId ? realTask : task
			),
		})),
	updateTask: (updatedTask) =>
		set((state) => {
			const updatedTasks = state.tasks.map((taskA) =>
				taskA._id === updatedTask._id ? { ...taskA, ...updatedTask } : taskA
			);
			return { tasks: updatedTasks };
		}),
	deleteTask: (taskId) =>
		set((state) => {
			const updatedTasks = state.tasks.filter((task) => task._id !== taskId);
			return { tasks: updatedTasks };
		}),
}));
