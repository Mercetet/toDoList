import { FC } from "react";
import { ISprint } from "../../../types/ISprint";
import styles from "./SprintCard.module.css";

import dayjs from "dayjs";
import { useSprint } from "../../../hooks/useSprint";
import { useNavigate } from "react-router-dom";

type SprintCardProps = {
	sprint: ISprint;
	handleOpenModalEdit: (sprint: ISprint) => void;
};

export const SprintCard: FC<SprintCardProps> = ({
	sprint,
	handleOpenModalEdit,
}) => {
	const { deleteExistingSprint } = useSprint();

	const navigate = useNavigate();

	const handleDeleteSprint = () => {
		deleteExistingSprint(sprint._id!);
	};

	const handleEditSprint = () => {
		handleOpenModalEdit(sprint);
	};

	const handleViewSprint = () => {
		navigate(`/sprint/${sprint._id}`);
	};

	return (
		<div className={styles.sprintCard}>
			<div className={styles.sprintCardData}>
				<h2>{sprint.nombre}</h2>
				<p>
					Inicio:{" "}
					{sprint.fechaInicio
						? dayjs(sprint.fechaInicio).format("DD-MM-YYYY")
						: "Sin fecha"}
				</p>
				<p>
					Cierre:{" "}
					{sprint.fechaCierre
						? dayjs(sprint.fechaCierre).format("DD-MM-YYYY")
						: "Sin fecha"}
				</p>
			</div>
			<div className={styles.sprintCardActions}>
				<button onClick={handleViewSprint}>
					<span className="material-symbols-outlined">visibility</span>
				</button>
				<button onClick={handleEditSprint}>
					<span className="material-symbols-outlined">edit</span>
				</button>
				<button onClick={handleDeleteSprint}>
					<span className="material-symbols-outlined">delete</span>
				</button>
			</div>
		</div>
	);
};
