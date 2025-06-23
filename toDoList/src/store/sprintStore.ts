import { create } from "zustand";
import { ISprint } from "../types/ISprint";
import { ITask } from "../types/ITask";


interface ISprintStore {
	sprints: ISprint[];
	taskBySprint: ITask[];
	setTaskBySprint: (tasks: ITask[]) => void;
	activeSprintForRoute: ISprint | null;
    setActiveSprintForRoute: (sprint: ISprint | null) => void;
	setArraySprints: (sprints: ISprint[]) => void;
	activeSprint: ISprint | null;
	setActiveSprint: (sprint: ISprint | null) => void;
	addSprint: (sprint: ISprint) => void;
	updateSprint: (sprint: ISprint) => void;
	deleteSprint: (sprintId: string) => void;
	
}

export const sprintStore = create<ISprintStore>((set) => ({
	sprints: [],
	taskBySprint: [],
	setTaskBySprint: (tasks) => set(() => ({ taskBySprint: tasks })),
	activeSprint: null,
	activeSprintForRoute: null,
    setActiveSprintForRoute: (sprint) => set(() => ({ activeSprintForRoute: sprint })),
	setArraySprints: (sprintArray) => set(() => ({ sprints: sprintArray })),
	setActiveSprint: (activeSprintIn) =>
		set(() => ({ activeSprint: activeSprintIn })),
	addSprint: (newSprint) =>
		set((state) => ({ sprints: [...state.sprints, newSprint] })),
	updateSprint: (updatedSprint) =>
		set((state) => {
			const updatedSprints = state.sprints.map((sprintA) =>
				sprintA._id === updatedSprint._id
					? { ...sprintA, ...updatedSprint }
					: sprintA
			);
			return { sprints: updatedSprints };
		}),
	deleteSprint: (sprintId) =>
		set((state) => {
			const updatedSprints = state.sprints.filter(
				(sprint) => sprint._id !== sprintId
			);
			return { sprints: updatedSprints };
		}),


	}));
