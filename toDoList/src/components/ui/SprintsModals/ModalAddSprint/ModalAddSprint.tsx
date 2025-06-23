import { FC, useEffect, useState } from "react";
import styles from "./ModalAddSprint.module.css";
import { useSprint } from "../../../../hooks/useSprint";
import { ISprint } from "../../../../types/ISprint";
import { sprintSchema } from "../../../Schemas/SprintSchema";

type ModalAddSprintProps = {
	handleCloseModalSprint: () => void;
};

const initialState: ISprint = {
	fechaInicio: "",
	fechaCierre: "",
	nombre: "",
	tareas: [],
};

export const ModalAddSprint: FC<ModalAddSprintProps> = ({
	handleCloseModalSprint,
}) => {
	const { addNewSprint } = useSprint();

	const [formValues, setFormValues] = useState(initialState);

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
		await addNewSprint(formValues); 
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
				<h2>Crear Sprint</h2>
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
							Crear Sprint
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
