import { toast } from "react-toastify";

export function handleFormErrors(errors, form) {
  errors.forEach(error => {
    if (form && error.path) {

      form.setError(error.path, { type: "custom", message: error.message });
      toast.error(error.message);

    } else {
      toast.error(error.message);
    }
  });
}
