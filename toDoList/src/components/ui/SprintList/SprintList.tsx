import { useEffect, useState } from "react";
import { useSprint } from "../../../hooks/useSprint";
import { sprintStore } from "../../../store/sprintStore";
import { SprintCard } from "../SprintCard/SprintCard";
import styles from "./SprintList.module.css";
import { ISprint } from "../../../types/ISprint";
import { ModalEditSprint } from "../SprintsModals/ModalEditSprint/ModalEditSprint";
import { useParams } from "react-router-dom";
import { ModalAddSprint } from "../SprintsModals/ModalAddSprint/ModalAddSprint";
export const SprintList = () => {
	const setActiveSprint = sprintStore((state) => state.setActiveSprint);
	const { getSprints, sprints } = useSprint();
	const { id } = useParams();
	const { getSprintById } = useSprint();

	const [openModalAddSprint, setOpenModalAddSprint] = useState(false);
	const [openModalSprint, setOpenModalSprint] = useState(false);

	

	const handleOpenModalEditSprint = (sprint: ISprint) => {
		setActiveSprint(sprint);
		setOpenModalSprint(true);
	};

	const handleCloseModalSprint = () => {
		setOpenModalSprint(false);
		setActiveSprint(null);
	};

	const handleCloseModalAddSprint = () => {
		setOpenModalAddSprint(false);
	};

	useEffect(() => {
		getSprints();
	}, [!openModalAddSprint, openModalSprint]);

	useEffect(() => {
		if (!id) return;
		const fetchSprint = async () => {
			try {
				const sprintData = await getSprintById(id);
				if (sprintData) setActiveSprint(sprintData);
			} catch (error) {
				console.error("Error al obtener el sprint:", error);
			}
		};

		fetchSprint();
	}, [id, openModalSprint]);

	return (
		<>
			<div className={styles.containerPrincipalListSprints}>
				<div className={styles.containerTitleListSprints}>
					<h1>Sprints</h1>
				</div>
				<div className={styles.containerSprints}>
					{sprints.length > 0 ? (
						sprints.map((el, idx) => (
							<SprintCard
								key={idx}
								handleOpenModalEdit={handleOpenModalEditSprint}
								sprint={el}
							/>
						))
					) : (
						<p>No hay sprints</p>
					)}
				</div>
				<div className={styles.containerButtonAddSprint}>
					<button
						onClick={() => {
							setOpenModalAddSprint(true);
						}}
						className={styles.buttonAddSprint}>
						Agregar Sprint
					</button>
				</div>
			</div>
			{openModalAddSprint && (
				<ModalAddSprint handleCloseModalSprint={handleCloseModalAddSprint} />
			)}

			{openModalSprint && (
				<ModalEditSprint handleCloseModalSprint={handleCloseModalSprint} />
			)}
		</>
	);
};
