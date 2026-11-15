
import { useState } from "react";

const initialValues = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

export function AddCourseForm({ onAdd }) {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [lastError, setLastError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setLastError(null);

    try {
      await onAdd({
        code: values.code,
        title: values.title,
        department: values.department,
        credits: Number(values.credits),
        capacity: Number(values.capacity),
        description: values.description === "" ? null : values.description,
      });

      // Clear the form after successful submission
      setValues(initialValues);
      setLastError(null);
    } catch (error) {
      // Preserve the entered values and display the error
      setLastError(error);
    } finally {
      setSubmitting(false);
    }
  }

  const fieldErrors = lastError?.fieldErrors ?? {};

  return (
    <section>
      <h2>Add a course</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="code">Code</label>
          <input
            id="code"
            name="code"
            value={values.code}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.code)}
            aria-describedby={
              fieldErrors.code ? "code-error" : undefined
            }
          />
          {fieldErrors.code && (
            <p id="code-error">{fieldErrors.code}</p>
          )}
        </div>

        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={
              fieldErrors.title ? "title-error" : undefined
            }
          />
          {fieldErrors.title && (
            <p id="title-error">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            value={values.department}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.department)}
            aria-describedby={
              fieldErrors.department ? "department-error" : undefined
            }
          />
          {fieldErrors.department && (
            <p id="department-error">{fieldErrors.department}</p>
          )}
        </div>

        <div>
          <label htmlFor="credits">Credits</label>
          <input
            type="number"
            id="credits"
            name="credits"
            value={values.credits}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.credits)}
            aria-describedby={
              fieldErrors.credits ? "credits-error" : undefined
            }
          />
          {fieldErrors.credits && (
            <p id="credits-error">{fieldErrors.credits}</p>
          )}
        </div>

        <div>
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={values.capacity}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.capacity)}
            aria-describedby={
              fieldErrors.capacity ? "capacity-error" : undefined
            }
          />
          {fieldErrors.capacity && (
            <p id="capacity-error">{fieldErrors.capacity}</p>
          )}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={
              fieldErrors.description ? "description-error" : undefined
            }
          />
          {fieldErrors.description && (
            <p id="description-error">{fieldErrors.description}</p>
          )}
        </div>

        {lastError && (
          <p role="alert">{lastError.message}</p>
        )}

        <button type="submit" disabled={submitting}>
          Add course
        </button>
      </form>
    </section>
  );
}
