# Audit — React Lab 2

## 0. What came back

| File the AI gave you | What's in it (components, hooks) | Lines |
| --- | --- | --- |
| `src/courses/CoursesPage.jsx` | `CoursesPage` component. Connects `useCourses`, `CoursesView` and `AddCourseForm`. | 6 - 22 |
| `src/courses/CoursesView.jsx` | `CoursesView` component. Displays loading, error, empty and course-list states. | 2 - 35 |
| `src/courses/AddCourseForm.jsx` | `AddCourseForm` component. Contains controlled form inputs, submission handling and error display. Uses `useState`. | 13 - 175 |
| `src/courses/useCourses.js` | `useCourses` custom hook. Handles the initial GET request, course state, status, errors and adding courses through POST. Uses `useState` and `useEffect`. | 5 - 60 |

- Does it run? The project runs sufficiently to execute the test suite, but the initial test results show that some functionality is not passing. Complete browser testing is still needed to verify that the course list loads, valid courses are added in sorted order, duplicate course codes display the 409 error message, and invalid input displays the corresponding fieldErrors under the inputs.
- Requests in the Network tab — on page load: Expected 1 GET request; per add: Expected 1 POST request. These counts still need to be confirmed in the browser's Network tab.
- npm test before any fix: 43 passed / 19 failed across 9 test files (6 passed / 3 failed). The failing test files need to be identified from the detailed test output.

## 1. Part A — walk the allowed list

| Element (the sheet, Part A) | Where it is in the AI's code (`file:line`, or "missing") | Right place? If not, where should it be? |
| --- | --- | --- |
| One View component that only renders | `CoursesView.jsx` — `CoursesView` | Yes. It only receives props and renders the appropriate UI. |
| Fetch + logic in a separate hook or module | `useCourses.js` — `useCourses` | Yes. The GET and POST requests and course-list logic are kept outside the View. |
| `useState` for the course list, at the right level | `useCourses.js` — `courses` state | Yes. The course list belongs in the custom hook because it manages the data. |
| `useState` for the form's inputs, at the right level | `AddCourseForm.jsx` — form input state | Yes. The form owns its input values because they are only needed by the form. |
| `useEffect` — for the initial fetch only (with a cleanup) | `useCourses.js` — initial GET effect | Yes. It loads the courses once on mount and uses an `ignore` flag in the cleanup. |
| Props down, callbacks up (the form raises "add this course") | `CoursesPage.jsx` passes `onAdd={addCourse}` to `AddCourseForm` | Yes. The form calls the callback, while the hook handles the actual POST request. |
| `.map` to render the list, with a stable `key` | `CoursesView.jsx` — course list rendering | Yes. Each course uses `key={course.id}`. |
| Loading / error / empty states, from one `status` | `CoursesView.jsx` — conditional rendering using `status` | Yes. The View handles loading, error and empty states before rendering the list. |

## 2. Part B — scan for "not yet"

| Not yet | Found? (`file:line`) | What it does in *this* slice | Cut, or keep — and why |
| --- | --- | --- | --- |
| `useMemo` | Not found | Not used. The course list does not need memoisation for this implementation. | No action needed. |
| `useCallback` | Not found | Not used. The callback passed to the form does not require memoisation here. | No action needed. |
| `useReducer` | Not found | Not used. The state is simple enough for `useState`. | No action needed. |
| `useRef` | Not found | Not used. No DOM reference or mutable value is needed. | No action needed. |
| Context (`createContext`, `useContext`) | Not found | Not used. The required data can be passed through the page using props. | No action needed. |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` | Not found in the intended implementation | The API requests use the provided `apiFetch` helper. | Keep `apiFetch`; it is required by the contract. |
| TypeScript (types, interfaces, `.ts`/`.tsx`) | Not found | The implementation uses JavaScript and JSX. | No action needed. |
| Anything else nobody taught you (name it) | No additional libraries or unfamiliar React hooks identified | The implementation uses ordinary React components, state and effects. | No action needed. |

## 3. The rule — every hook and every component split

| Hook call or component (`file:line`) | What earns it here? (one sentence) | Keep / cut / move (to where) |
| --- | --- | --- |
| `CoursesPage.jsx` — `CoursesPage` | It connects the data hook, course-list View and add-course form to build the page. | Keep. |
| `CoursesView.jsx` — `CoursesView` | It displays the course list and loading, error and empty states using the props it receives. | Keep. |
| `AddCourseForm.jsx` — `AddCourseForm` | It collects the course details and sends them to the parent through `onAdd`. | Keep. |
| `AddCourseForm.jsx` — `useState` for form values | It stores the six input values so the form is controlled. | Keep. |
| `AddCourseForm.jsx` — `useState` for submitting state | It tracks whether a POST request is in progress so the submit button can be disabled. | Keep. |
| `AddCourseForm.jsx` — `useState` for the last error | It stores the submission error so the message can be displayed without clearing the user's input. | Keep. |
| `useCourses.js` — `useCourses` | It separates course fetching and state management from the UI components. | Keep. |
| `useCourses.js` — `useState` for courses | It stores the current course list and allows the list to be updated after a successful add. | Keep. |
| `useCourses.js` — `useState` for status | It tracks whether the initial request is loading, ready or has failed. | Keep. |
| `useCourses.js` — `useState` for error | It stores the error message when the initial GET request fails. | Keep. |
| `useCourses.js` — `useEffect` for initial fetch | It loads the course list once when the page appears and ignores stale responses after cleanup. | Keep. |

## 4. Decisions — before any fix prompt

- I will **cut**: Nothing identified in the intended implementation. It does not use unnecessary hooks, context or additional libraries.
- I will **move**: Nothing. The course-list state and API logic are in `useCourses`, while the form state stays in `AddCourseForm`.
- I will **add**: No additional functionality identified as missing from the intended implementation. I will verify that the duplicate-code error and field-level validation errors are displayed correctly.
- Other smells I found (state stored that could be computed, a reload after add, browser validation, `key={index}`, swallowed errors…):
  - The course list should be updated using the POST response rather than making another GET request.
  - The newly created course should be inserted into a new array and sorted by course code.
  - The form should not clear its values when the server returns an error.
  - Browser-side validation should not prevent invalid values from reaching the server.
  - The list should use `course.id` as its key instead of the array index.
  - POST errors should propagate from `useCourses` to `AddCourseForm` instead of being swallowed.

---

## 5. Strip check (section 14 of the doc)

No "not yet" items were identified in the intended implementation, so there were no unnecessary hooks or libraries to remove and test individually.

The original prompt explicitly restricted the implementation to `useState` and `useEffect`, prohibited `useMemo`, `useCallback`, `useReducer`, `useRef` and Context, and required JavaScript with the existing `apiFetch` helper. These rules helped prevent unnecessary complexity and additional dependencies.

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
| --- | --- | --- |
| None — no unnecessary "not yet" items identified | Not applicable | Not applicable |

## 6. Before / after

|  | Before (the AI's first version) | After (yours) |
| --- | --- | --- |
| Files and components | Four files: `CoursesPage`, `CoursesView`, `AddCourseForm` and `useCourses`. | Same four-file structure, subject to any changes made during the audit and fix. |
| `useState` calls (and where) | Course list, status and error in `useCourses`; form values, submitting state and last error in `AddCourseForm`. | No changes planned unless the audit or tests reveal unnecessary state. |
| `useEffect` calls | One effect in `useCourses` for the initial GET request, with cleanup. | One effect for the initial GET request, with cleanup. |
| "Not yet" items | None identified in the intended implementation. | None identified. |
| Requests: on load / per add | 1 GET on page load / 1 POST per add. | 1 GET on page load / 1 POST per add; no extra GET after adding. |
| `npm test` | Results not recorded. | Results not recorded; run `npm test` after the audit/fix to confirm. |

## 7. Two sentences

- One thing the AI got right that you might not have thought of: It separated the API and course-list logic into a custom hook, keeping the View component focused only on rendering.
- One thing you will never accept from an AI without checking again: I will never assume that generated code is correct just because it follows the requested structure; I will check its behaviour, API requests, error handling and test results myself.