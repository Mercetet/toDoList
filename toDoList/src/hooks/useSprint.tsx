import { sprintStore } from "../store/sprintStore";

import {
	getSprintsController,
	createSprintController,
	updateSprintController,
	deleteSprintController,
} from "../data/sprintListController";
import { useShallow } from "zustand/shallow";
import { ISprint } from "../types/ISprint";
import Swal from "sweetalert2";

export const useSprint = () => {
	const { sprints, setArraySprints, addSprint, updateSprint, deleteSprint } =
		sprintStore(
			useShallow((state) => ({
				sprints: state.sprints,
				setArraySprints: state.setArraySprints,
				addSprint: state.addSprint,
				updateSprint: state.updateSprint,
				deleteSprint: state.deleteSprint,
			}))
		);

	const getSprints = async () => {
		const data = await getSprintsController();
		if (data) {
			setArraySprints(data);
		}
	};

	const addNewSprint = async (newSprint: ISprint) => {
		try {
			const NewSprint = await createSprintController(newSprint); 
			if (NewSprint) {
				addSprint(NewSprint); 
				await getSprints()
			}
		} catch (error) {
			console.error("Error en addNewSprint:", error);
		}
	};
	

	const updateExistingSprint = async (updatedSprint: ISprint) => {
		const previousSprint = sprints.find((el) => el._id === updatedSprint._id);
		if (previousSprint) {
			updateSprint(updatedSprint);
			try {
				await updateSprintController(updatedSprint);
			} catch (error) {
				updateSprint(previousSprint);
				console.error("Error en updateExistingSprint:", error);
			}
		}
	};

	const deleteExistingSprint = async (idDeletedSprint: string) => {
		const previousSprint = sprints.find(
			(sprint) => sprint._id === idDeletedSprint
		);
		Swal.fire({
			title: "Estas seguro?",
			text: "No podra recuperarse!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminar!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				deleteSprint(idDeletedSprint);
				try {
					await deleteSprintController(idDeletedSprint);
					Swal.fire("Eliminado!", "El sprint ha sido eliminado.", "success");
				} catch (error) {
					addSprint(previousSprint!);
					console.error("Error en deleteExistingSprint:", error);
				}
			}
		});
	};

	const getSprintById = async (id: string) => {
		const sprintsGetByID = await getSprintsController();
		const sprint = sprintsGetByID.find((sprint) => sprint._id === id);
		if (!sprint) {
			console.error("Sprint not found:", id);
			return null;
		}
		return sprint;
	};

	

	return {
		sprints,
		getSprints,
		addNewSprint,
		updateExistingSprint,
		deleteExistingSprint,
		getSprintById,
	};
};
