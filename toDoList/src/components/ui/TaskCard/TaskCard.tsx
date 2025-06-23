import { FC } from "react";
import { ITask } from "../../../types/ITask";
import styles from "./TaskCard.module.css";
import { useTask } from "../../../hooks/useTask";
import dayjs from "dayjs";

import Tooltip from "../Tooltip/Tooltip";

type TaskCardProps = {
	task: ITask;
	handleOpenModalEdit: (task: ITask) => void;
	handleOpenView: (task: ITask) => void;
	handleOpenAddTask: (task: ITask) => void;
};

export const TaskCard: FC<TaskCardProps> = ({
	task,
	handleOpenModalEdit,
	handleOpenView,
	handleOpenAddTask,
}) => {
	const { deleteExistingTask } = useTask();

	const handleDeleteTask = () => {
		deleteExistingTask(task._id!);
	};

	const handleEditTask = () => {
		handleOpenModalEdit(task);
	};

	const handleViewTask = () => {
		handleOpenView(task);
	};

	const handleAddTask = () => {
		handleOpenAddTask(task);
	};

	const actualTime = new Date().getTime();
	const taskTime = new Date(task.fechaLimite).getTime();
	const missingDays = Math.ceil(
		(taskTime - actualTime) / (1000 * 60 * 60 * 24)
	);
	const showWarning = missingDays < 3 && task.estado !== "Completado";

	return (
		<div className={styles.containerPrincipaltaskCard}>
			<div className={styles.taskCardData}>
				<h2>{task.titulo}</h2>

				<p>
					Fecha Límite:{" "}
					{task.fechaLimite
						? dayjs(task.fechaLimite).format("DD-MM-YYYY")
						: "Sin fecha"}
				</p>

				<p>Estado: {task.estado}</p>
			</div>
			<div className={styles.taskCardActions}>
				<div className={styles.taskCardActionsButtons}>
					<div>
						<button onClick={handleAddTask}>
							<span className="material-symbols-outlined">add</span>
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
					<button onClick={handleViewTask}>
						<span className="material-symbols-outlined">visibility</span>
					</button>
					<button onClick={handleEditTask}>
						<span className="material-symbols-outlined">edit</span>
					</button>
					<button onClick={handleDeleteTask}>
						<span className="material-symbols-outlined">delete</span>
					</button>
				</div>
			</div>
		</div>
	);
};
