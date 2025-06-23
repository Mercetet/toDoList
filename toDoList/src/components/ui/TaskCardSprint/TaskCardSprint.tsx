import { FC } from "react";
import { ITask } from "../../../types/ITask";
import styles from "./TaskCardSprint.module.css";
import { useSprint } from "../../../hooks/useSprint";
import { useTask } from "../../../hooks/useTask";
import { sprintStore } from "../../../store/sprintStore";
import Tooltip from "../Tooltip/Tooltip";
import dayjs from "dayjs";
import { ISprint } from "../../../types/ISprint";

type TaskCardSprintProps = {
	task: ITask;
	handleOpenView: (task: ITask) => void;
	handleOpenEdit: (task: ITask) => void;
	handleStatus: (task: ITask) => void;
};

export const TaskCardSprint: FC<TaskCardSprintProps> = ({
	task,
	handleOpenEdit,
	handleOpenView,
	handleStatus,
}) => {
	const { updateExistingSprint } = useSprint();
	const { addNewTask } = useTask();
	const activeSprint = sprintStore((state) => state.activeSprint);
	const setActiveSprint = sprintStore((state) => state.setActiveSprint);

	const handleChangeStatusTask = () => {
		handleStatus(task);
	};

	const handleEditTask = () => {
		handleOpenEdit(task);
	};

	const handleViewTask = () => {
		handleOpenView(task);
	};

	const handleBacklogTask = async () => {
		if (!task._id) return;

		const updatedSprint = {
			...activeSprint!,
			tareas: activeSprint!.tareas.filter((t) => t._id !== task._id),
		};

		await addNewTask(task);
		await updateExistingSprint(updatedSprint);
		setActiveSprint(updatedSprint);
	};

	const actualTime = new Date().getTime();
	const taskTime = new Date(task.fechaLimite).getTime();
	const missingDays = Math.ceil(
		(taskTime - actualTime) / (1000 * 60 * 60 * 24)
	);
	const showWarning = missingDays < 3 && task.estado !== "Completado";

	return (
		<div className={styles.containerPrincipalTaskCardSprint}>
			<div className={styles.taskCardSprintData}>
				<h2>{task.titulo}</h2>

				<p>
					Fecha Límite:{" "}
					{task.fechaLimite
						? dayjs(task.fechaLimite).format("DD-MM-YYYY")
						: "Sin fecha"}
				</p>
				<p
					className={`${styles.taskStatus} ${
						styles[task.estado.toLowerCase().replace(/\s+/g, "")]
					}`}>
					Estado: {task.estado}
				</p>
			</div>
			<div className={styles.taskCardSprintActions}>
				<div className={styles.taskCardSprintActionsButtons}>
					<button onClick={handleBacklogTask}>Backlog</button>
					<button onClick={handleChangeStatusTask}>
						<span className="material-symbols-outlined">send</span>
					</button>
				</div>

				{showWarning && (
					<div className={styles.taskCardSprintActionsWarning}>
						<Tooltip text="Tarea próxima a vencer">
							<button>
								<span className="material-symbols-outlined">error</span>
							</button>
						</Tooltip>
					</div>
				)}

				<div className={styles.taskCardSprintActionsButtons}>
					<button onClick={handleViewTask}>
						<span className="material-symbols-outlined">visibility</span>
					</button>
					<button onClick={handleEditTask}>
						<span className="material-symbols-outlined">edit</span>
					</button>
				</div>
			</div>
		</div>
	);
};
