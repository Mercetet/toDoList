import { FC } from "react";
import styles from "./ModalViewTask.module.css";

import dayjs from "dayjs";
import { taskStore } from "../../../../store/taskStore";

type ModalViewTaskProps = {
	handleCloseViewModalTask: () => void;
};

export const ModalViewTask: FC<ModalViewTaskProps> = ({
	handleCloseViewModalTask,
}) => {
	const activeTask = taskStore((state) => state.activeTask);
	const setActiveTask = taskStore((state) => state.setActiveTask);

	const handleClose = () => {
		setActiveTask(null);
		handleCloseViewModalTask();
	};

	return (
		<div className={styles.containerPrincipalViewModalTask}>
			<div className={styles.containerViewModalTask}>
				<h2>{activeTask?.titulo}</h2>

				<div className={styles.containerDataViewModalTask}>
					<div className={styles.containerDataViewModalTaskDescripcion}>
						<p>{activeTask?.descripcion}</p>
					</div>
					<p>
						<strong>Fecha Límite: </strong>
						{activeTask!.fechaLimite
							? dayjs(activeTask!.fechaLimite).format("DD-MM-YYYY")
							: "Sin fecha"}
					</p>
					<p>
						<strong>Estado:</strong> {activeTask?.estado}
					</p>
				</div>

				<button onClick={handleClose} className={styles.buttonCloseModal}>
					Cerrar
				</button>
			</div>
		</div>
	);
};
