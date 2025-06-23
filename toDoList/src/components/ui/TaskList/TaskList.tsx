import { useEffect, useState } from "react";
import { useTask } from "../../../hooks/useTask";
import { taskStore } from "../../../store/taskStore";
import { TaskCard } from "../TaskCard/TaskCard";
import styles from "./TaskList.module.css";
import { ITask } from "../../../types/ITask";
import { ModalTask } from "../TasksModals/ModalTask/ModalTask";
import { ModalViewTask } from "../TasksModals/ModalViewTask/ModalViewTask";
import { ModalAddTaskToSprint } from "../TasksModals/ModalAddTaskToSprint/ModalAddTaskToSprint";

export const TaskList = () => {
	const setActiveTask = taskStore((state) => state.setActiveTask);
	const { getTasks, tasks } = useTask();
	
	const [openModalTask, setOpenModalTask] = useState(false);
	const [openViewModalTask, setOpenViewModalTask] = useState(false);
	const [openAddTask, setOpenAddTask] = useState(false);


	useEffect(() => {
		getTasks();
	}, []);

	const handleOpenModalEditTask = (task: ITask) => {
		setActiveTask(task);
		setOpenModalTask(true);
	};

	const handleOpenViewTask = (task: ITask) => {
		setActiveTask(task);
		setOpenViewModalTask(true);
	};

	const handleCloseViewModalTask = () => {
		setOpenViewModalTask(false);
	};

	const handleCloseModalTask = () => {
		setOpenModalTask(false);
		setActiveTask(null);
		
	};

	const handleAddTask = (task: ITask) => {
		setActiveTask(task);
		setOpenAddTask(true);
	};

	const handleCloseModalAddTask = () => {
		setOpenAddTask(false);
		setActiveTask(null);
	};

	return (
		<>
			<div className={styles.containerDataTaskList}>
				<div className={styles.titleandbuttonTaskList}>
					<h2>Backlog</h2>
					<button
						onClick={() => {
							setOpenModalTask(true);
						}}>
						Crear Tarea
					</button>
				</div>
				<div className={styles.containerTasks}>
					{tasks.length > 0 ? (
						tasks.map((el, idx) => (
							<TaskCard
								key={idx}
								handleOpenModalEdit={handleOpenModalEditTask}
								task={el}
								handleOpenView={handleOpenViewTask}
								handleOpenAddTask={handleAddTask}
							/>
						))
					) : (
						<div>
							<h3>No hay tareas</h3>
						</div>
					)}
				</div>
			</div>
			{openModalTask && (
				<ModalTask handleCloseModalTask={handleCloseModalTask} />
			)}
			{openViewModalTask && (
				<ModalViewTask handleCloseViewModalTask={handleCloseViewModalTask} />
			)}
			{openAddTask && (
				<ModalAddTaskToSprint
					handleCloseModalAddTask={handleCloseModalAddTask}
				/>
			)}
		</>
	);
};
