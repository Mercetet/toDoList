import * as Yup from "yup";

export const taskSchema = Yup.object().shape({
	titulo: Yup.string()
		.required("El título es obligatorio")
		.min(5, "El título debe tener al menos 5 caracteres"),

	descripcion: Yup.string()
		.required("La descripción es obligatoria")
		.min(10, "La descripción debe tener al menos 10 caracteres"),

	estado: Yup.string().required("El estado es obligatorio"),

	fechaLimite: Yup.date()
		.required("La fecha límite es obligatoria")
		.typeError("La fecha límite no es válida")
		.test("is-future-date", "La fecha no puede ser anterior a hoy", (value) => {
			if (!value) return false;
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const selectedDate = new Date(value);
			selectedDate.setHours(0, 0, 0, 0); 
			return selectedDate >= today;
		}),
});
