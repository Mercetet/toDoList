import { useEffect, useState } from "react";
import { sprintStore } from "../../../store/sprintStore";
import { TaskCardSprint } from "../TaskCardSprint/TaskCardSprint";
import styles from "./SprintView.module.css";
import { ITask } from "../../../types/ITask";
import { taskStore } from "../../../store/taskStore";
import { ModalViewTask } from "../TasksModals/ModalViewTask/ModalViewTask";
import { ModalAddTaskSprintView } from "../TasksModals/ModalAddTaskSprintView/ModalAddTaskSprintView";
import { useParams } from "react-router-dom";
import { useSprint } from "../../../hooks/useSprint";
import { SprintServices } from "../../../services/SprintServices";
import { useTask } from "../../../hooks/useTask";

export const SprintView = () => {
	const { id } = useParams();
	const { getSprintById, updateExistingSprint } = useSprint();
	const {updateExistingTaskInSprint} = useTask()
	const setActiveSprint = sprintStore((state) => state.setActiveSprint);
	const setActiveTask = taskStore((state) => state.setActiveTask);
	const activeSprint = sprintStore((state) => state.activeSprint);
	const [openModalAddTask, setOpenModalAddTask] = useState(false);
	const [openViewModalTask, setOpenViewModalTask] = useState(false);
	const tasksBySprint = sprintStore((state) => state.taskBySprint);
	const setTaskBySprint = sprintStore((state) => state.setTaskBySprint);
	const SprintsServices = new SprintServices();

	const handleChangeStatus = (task: ITask) => {
		setActiveTask(task);

		const estados = ["pendiente", "en_progreso", "completado"];
		const currentIndex = estados.indexOf(task.estado);
		const nextEstado = estados[(currentIndex + 1) % estados.length];

		const updatedTask = {
			...task,
			estado: nextEstado,
		};

		const updatedSprint = {
			...activeSprint!,
			tareas: activeSprint!.tareas.map((t) =>
				t._id === task._id ? updatedTask : t
			),
		};

		updateExistingTaskInSprint(updatedTask,updatedSprint );
		setActiveSprint(updatedSprint);
		setActiveTask(null);
	};

	const handleOpenModalEditTask = (task: ITask) => {
		setActiveTask(task);
		console.log(task);
		setOpenModalAddTask(true);
	};

	const handleOpenModalViewTask = (task: ITask) => {
		setActiveTask(task);
		setOpenViewModalTask(true);
	};

	const handleCloseModalAddTask = () => {
		setOpenModalAddTask(false);
		setActiveTask(null);
	};

	const handleCloseModalViewTask = () => {
		setOpenViewModalTask(false);
		setActiveTask(null);
	};

	useEffect(() => {
		const fetchSprint = async () => {
			try {
				if (id) {
					const sprintData = await getSprintById(id);

					setActiveSprint(sprintData);
				} else {
					console.error("No se encontró el ID del sprint en la URL");
				}
			} catch (error) {
				console.error("Error al obtener el sprint:", error);
			}
		};
		if (id) {
			fetchSprint();
		}
	}, [id]);

	useEffect(() => {
		const fetchTasksBySprint = async () => {
			try {
				if (activeSprint?._id) {
					const tasksData = await SprintsServices.tasksBySprint(activeSprint._id);
					if (tasksData && tasksData.sprint && Array.isArray(tasksData.sprint.tareas)) {
						setTaskBySprint(tasksData.sprint.tareas);
					} else {
						console.error("No se encontraron tareas en el sprint.");
					}
				}
			} catch (error) {
				console.error("Error al obtener las tareas:", error);
			}
		};
		if (activeSprint) {
			fetchTasksBySprint();
		}
	}, [activeSprint, id]);
	

	const pendingTasks = tasksBySprint.filter(
		(task) => task.estado === "pendiente"
	);
	const inProgressTasks = tasksBySprint.filter(
		(task) => task.estado === "en_progreso"
	);
	const completedTasks = tasksBySprint.filter(
		(task) => task.estado === "completado"
	);

	return (
		<>
			<div className={styles.sprintViewPrincipalContainer}>
				<div className={styles.titleAndButtonSprintView}>
					<div></div>
					<h2>{activeSprint?.nombre}</h2>
					<button onClick={() => setOpenModalAddTask(true)}>
						Añadir Tarea
					</button>
				</div>
				<div className={styles.columnsSprintView}>
					<div className={`${styles.columnTaskSprintView} ${styles.pending}`}>
						<h3>Pendiente</h3>
						{pendingTasks.map((task, idx) => (
							<TaskCardSprint
								key={task._id ? task._id : idx}
								task={task}
								handleOpenEdit={handleOpenModalEditTask}
								handleOpenView={handleOpenModalViewTask}
								handleStatus={handleChangeStatus}
							/>
						))}
					</div>

					<div className={`${styles.columnTaskSprintView} ${styles.process}`}>
						<h3>En Proceso</h3>
						{inProgressTasks.map((task, idx) => (
							<TaskCardSprint
								key={task._id ? task._id : idx}
								task={task}
								handleOpenEdit={handleOpenModalEditTask}
								handleOpenView={handleOpenModalViewTask}
								handleStatus={handleChangeStatus}
							/>
						))}
					</div>

					<div className={`${styles.columnTaskSprintView} ${styles.completed}`}>
						<h3>Completado</h3>
						{completedTasks.map((task, idx) => (
							<TaskCardSprint
								key={task._id ? task._id : idx}
								task={task}
								handleOpenEdit={handleOpenModalEditTask}
								handleOpenView={handleOpenModalViewTask}
								handleStatus={handleChangeStatus}
							/>
						))}
					</div>
				</div>
			</div>
			{openModalAddTask && (
				<ModalAddTaskSprintView
					handleCloseModalAddTask={handleCloseModalAddTask}
				/>
			)}
			{openViewModalTask && (
				<ModalViewTask handleCloseViewModalTask={handleCloseModalViewTask} />
			)}
		</>
	);
};
