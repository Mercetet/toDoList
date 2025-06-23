import { FC, useEffect, useState } from "react";
import styles from "./ModalEditSprint.module.css";
import { sprintStore } from "../../../../store/sprintStore";
import { useSprint } from "../../../../hooks/useSprint";
import { ISprint } from "../../../../types/ISprint";
import { sprintSchema } from "../../../Schemas/SprintSchema";
import { useTask } from "../../../../hooks/useTask";

type ModalEditSprintProps = {
	handleCloseModalSprint: () => void;
};

const initialState: ISprint = {
	fechaInicio: "",
	fechaCierre: "",
	nombre: "",
	tareas: [],
};

export const ModalEditSprint: FC<ModalEditSprintProps> = ({
	handleCloseModalSprint,
}) => {
	const activeSprint = sprintStore((state) => state.activeSprint);
	const setActiveSprint = sprintStore((state) => state.setActiveSprint);

	const { updateExistingSprint } = useSprint();

	const [formValues, setFormValues] = useState(initialState);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toISOString().split("T")[0];
	};

	useEffect(() => {
		if (activeSprint) {
			setFormValues({
				_id: activeSprint._id,
				fechaInicio: formatDate(activeSprint.fechaInicio),
				fechaCierre: formatDate(activeSprint.fechaCierre),
				nombre: activeSprint.nombre,
				tareas: activeSprint.tareas,
			});
		}
	}, []);

	const handleChange = async (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		if (name === "fechaInicio") {
			setFormValues((prev) => ({
				...prev,
				fechaInicio: value,
				fechaCierre: "",
			}));
		} else {
			setFormValues((prev) => ({ ...prev, [name]: value }));
		}

		try {
			await sprintSchema.validateAt(name, {
				...formValues,
				[name]: value,
				...(name === "fechaInicio" ? { fechaCierre: "" } : {}),
			});
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				if (name === "fechaInicio") delete newErrors["fechaCierre"];
				return newErrors;
			});
		} catch (err: any) {
			setErrors((prev) => ({
				...prev,
				[name]: err.message,
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await sprintSchema.validate(formValues, { abortEarly: false });
		updateExistingSprint(formValues);
		setActiveSprint(null);
		handleCloseModalSprint();
	};

	const isFormValid = () => {
		const hasErrors = Object.keys(errors).length > 0;
		const hasEmptyFields = Object.values(formValues)
			.filter((value): value is string => typeof value === "string")
			.some((value) => value.trim() === "");

		return !hasErrors && !hasEmptyFields;
	};

	useEffect(() => {
		isFormValid();
	}, [formValues]);

	const [errors, setErrors] = useState<Record<string, string>>({});

	return (
		<div className={styles.containerPrincipalModalSprint}>
			<div className={styles.containerModalSprint}>
				<h2>Editar Sprint</h2>
				<form onSubmit={handleSubmit} className={styles.containerForm}>
					<div className={styles.containerInput}>
						<div className={styles.inputContainer}>
							<input
								type="text"
								name="nombre"
								placeholder="Nombre del Sprint"
								required
								autoComplete="off"
								value={formValues.nombre}
								onChange={handleChange}
							/>
							{errors.nombre && <p className={styles.error}>{errors.nombre}</p>}
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor="fechaInicio">Fecha de Inicio</label>
							<input
								type="date"
								name="fechaInicio"
								required
								autoComplete="off"
								value={formValues.fechaInicio}
								onChange={handleChange}
							/>
							{errors.fechaInicio && (
								<p className={styles.error}>{errors.fechaInicio}</p>
							)}
						</div>
						<div className={styles.inputContainer}>
							<label htmlFor="fechaCierre">Fecha de Cierre</label>
							<input
								type="date"
								name="fechaCierre"
								required
								autoComplete="off"
								value={formValues.fechaCierre}
								onChange={handleChange}
							/>
							{errors.fechaCierre && (
								<p className={styles.error}>{errors.fechaCierre}</p>
							)}
						</div>
					</div>
					<div className={styles.containerButtons}>
						<button
							className={styles.cancelbtn}
							onClick={handleCloseModalSprint}>
							Cancelar
						</button>
						<button
							className={styles.submitbtn}
							disabled={!isFormValid()}
							type="submit">
							Editar Sprint
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
