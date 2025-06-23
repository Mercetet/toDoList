import { FC, useEffect, useState } from "react";
import styles from "./ModalAddTaskToSprint.module.css";
import { taskStore } from "../../../../store/taskStore";
import { sprintStore } from "../../../../store/sprintStore";
import { SprintServices } from "../../../../services/SprintServices";
import { addTaskToSprintController } from "../../../../data/sprintListController";

type ModalAddTaskToSprintProps = {
	handleCloseModalAddTask: () => void;
};

export const ModalAddTaskToSprint: FC<ModalAddTaskToSprintProps> = ({
	handleCloseModalAddTask,
}) => {
	const activeTask = taskStore((state) => state.activeTask);
	const sprints = sprintStore((state) => state.sprints);

	const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

	const deleteTask = taskStore((state) => state.deleteTask);

	useEffect(() => {
		if (sprints.length > 0 && selectedSprintId === null) {
			setSelectedSprintId(sprints[0]?._id || null);
		}
		console.log("activeTask", activeTask);
	}, [sprints, selectedSprintId]);

	const handleUpdateSprint = async () => {
		if (selectedSprintId && activeTask) {
			await addTaskToSprintController(selectedSprintId, activeTask._id!);
			deleteTask(activeTask._id!);
			handleCloseModalAddTask();
		} else {
			return;
		}
	};
	
	return (
		<div className={styles.containterPrincipalModalAddTask}>
			<div className={styles.containerModalAddTask}>
				<div className={styles.containerData}>
					<div className={styles.card}>
						<h2>Agregar tarea</h2>
						<div className={styles.taskInfo}>
							<p>
								<strong>Tarea:</strong> {activeTask?.titulo}
							</p>
							<p>
								<strong>Al Sprint:</strong>{" "}
								{sprints.find((s) => s._id === selectedSprintId)?.nombre}
							</p>
						</div>
					</div>

					<label>Seleccionar Sprint:</label>
					{sprints.length > 0 ? (
						<select
							value={selectedSprintId || ""}
							onChange={(e) => setSelectedSprintId(e.target.value)}>
							{sprints.map((sprint, idx) => (
								<option key={sprint._id ? sprint._id : idx} value={sprint._id}>
									{sprint.nombre}
								</option>
							))}
						</select>
					) : (
						<p>No hay sprints disponibles.</p>
					)}
				</div>

				<div className={styles.containerButtons}>
					<button
						className={styles.cancelbtn}
						onClick={handleCloseModalAddTask}>
						Cancelar
					</button>
					<button className={styles.submitbtn} onClick={handleUpdateSprint}>
						Agregar Tarea
					</button>
				</div>
			</div>
		</div>
	);
};
