# Prompt log --- React Lab 2

**Name:** Samridh Ramesha\
**Roll number:** MT2026085\
**AI tool and plan:** ChatGPT (GPT-6), Go plan

> This log records the prompts and AI assistance used for the Courses
> page and the pre-lab search components. Prompt replies are summarized
> rather than reproduced as complete source files.

------------------------------------------------------------------------

## Prompt 1 --- generate

**Sent:**

``` text
CONTRACT.md prompt 1, unchanged
```

**What came back:**

The response began with guidance for implementing `AddCourseForm.jsx` as
a controlled form using `useState`. It described handling server-side
validation errors, preserving entered values after failure, clearing the
form after success, and keeping API calls outside the form. The response
also suggested implementing `useCourses.js`, `CoursesView.jsx`, and
`CoursesPage.jsx` and then running the tests.

**Did it run?**

The supplied prompt/response notes do not record whether `npm run dev`
or `npm test` was run, nor do they record pass/fail counts. These
results should be filled in from the actual local run rather than
guessed.

**What I did with it:**

Used the contract as the specification and continued
implementing/auditing the individual components against §4.

------------------------------------------------------------------------

## Prompt 2 --- implement CoursesPage

**Why I sent it:**

The starter `CoursesPage` component still contained a placeholder. I
needed it to connect the hook, the list View, and the add form as
required by CONTRACT §4.

**Sent:**

``` jsx
// Lab day (AI required): the Courses page — list + add. src/App.jsx renders it.
// You generate it with AI from CONTRACT.md, then audit and fix it (doc sections 10–14).
export function CoursesPage() {
  return (
    <section className="courses-page">
      <h1>Courses</h1>
      <p className="todo">Built in the lab, with AI — see CONTRACT.md.</p>
    </section>
  );
}
```

**What came back:**

A named `CoursesPage` export that calls `useCourses()`, then renders the
`Courses` heading, `CoursesView` with `courses`, `status`, and `error`
props, and `AddCourseForm` with `onAdd={addCourse}`.

**What I kept, and what I rejected:**

Kept the component composition because it matches the required
separation of responsibilities in §4. No additional page-level state or
API logic was needed.

------------------------------------------------------------------------

## Prompt 3 --- implement CoursesView

**Why I sent it:**

The `CoursesView` starter contained a TODO. The contract requires a
view-only component that renders the loading, error, empty, or
course-list state.

**Sent:**

``` jsx
// Lab day (AI required). This file ends up as the View described in CONTRACT.md §4.
export function CoursesView() {
  throw new Error("TODO (lab day): CoursesView — see CONTRACT.md §4");
}
```

**What came back:**

A named `CoursesView({ courses, status, error })` component using
conditional rendering: - `loading` displays `Loading courses…`. -
`error` displays `Couldn't load courses: {error}`. - An empty course
array displays `No courses yet.`. - Otherwise, it renders a `<ul>` with
one keyed `<li>` per course, showing the code/title and
credits/department/seat availability.

The response kept fetching and state management out of the View.

**What I kept, and what I rejected:**

Kept the presentational-only structure and the status-based rendering.
No hooks, fetch calls, or local state were added.

------------------------------------------------------------------------

## Prompt 4 --- implement useCourses

**Why I sent it:**

The `useCourses` starter contained a TODO. The hook needed to own the
initial GET request, loading/error state, and POST logic for adding a
course.

**Sent:**

``` jsx
// Lab day (AI required). This file ends up as the hook described in CONTRACT.md §4.
export function useCourses() {
  throw new Error("TODO (lab day): useCourses — see CONTRACT.md §4");
}
```

**What came back:**

A `useCourses` hook using `useState` and `useEffect`. It: - Loads
`/api/courses` through `apiFetch`. - Tracks `courses`, `status`, and
`error`. - Uses an `ignore` flag in the effect cleanup to prevent stale
responses from updating state. - Implements `addCourse(courseRequest)`
with a POST request. - Inserts the returned course into a new array
sorted by course code. - Returns the created course and allows POST
errors to propagate to the form.

The response also provided a manual test checklist for loading, adding,
sorting, validation errors, and preserving form values after failure.

**What I kept, and what I rejected:**

Kept the separation between API logic in the hook and submission/error
presentation in the form. The supplied notes do not include actual test
output, so I have not recorded an unverified test result.

------------------------------------------------------------------------

## Prompt 5 --- implement SearchResults

**Why I sent it:**

The pre-lab `SearchResults` component was a TODO. It needed to render
search states using only the `results` and `status` props.

**Sent:**

``` jsx
// Pre-lab section 04 — a view that only renders.
//
// SearchResults({ results, status }) shows what a search found. Everything it shows
// arrives as props; it returns JSX. No fetch, no hooks, no state — so it can be tested,
// and reused, with nothing but an array and a string.
//
//   status "idle"                    → nothing at all (return null)
//   status "loading"                 → <p>Searching…</p>
//   status "error"                   → <p>Search failed.</p>
//   status "ready", results is empty → <p>No courses match.</p>
//   status "ready"                   → a <ul>, one <li> per course: "CS101 · Programming Fundamentals"
//                                      (key: the course's id)
export function SearchResults({ results, status }) {
  throw new Error("TODO");
}
```

**What came back:**

A presentational component with conditional returns for `idle`,
`loading`, `error`, and `ready`. For a ready response, it displays
`No courses match.` when the array is empty; otherwise it maps the
courses into a `<ul>` and uses `course.id` as each list item's key.

**What I kept, and what I rejected:**

Kept the conditional rendering and the `course.id` key. The component
does not fetch data or own state.

------------------------------------------------------------------------

## Prompt 6 --- implement useCourseSearch

**Why I sent it:**

The pre-lab search hook was a TODO. It needed to trim the query, avoid
requests for blank input, safely encode the query parameter, and ignore
stale responses when the query changes.

**Sent:**

``` jsx
// Pre-lab section 05 — an effect that fetches: dependencies and cleanup.
//
// useCourseSearch(query) → { results, status }
//
//   - Trim the query. A blank query sends NO request and returns { results: [], status: "idle" }.
//   - Otherwise, GET /api/courses?q=<query> with apiFetch. Build the query string with
//     URLSearchParams (JS Lab 2 §04), so "R&D" can't break the URL.
//       status "loading" while the request is on its way,
//       status "ready" with results = the courses it returned,
//       status "error" if it failed.
//   - Search again whenever the (trimmed) query changes — and only then: get the
//     dependency array right.
//   - Only the LATEST query's answer may reach the screen. Use an `ignore` flag that the
//     effect's cleanup sets to true (JS Lab 2 §09: the same idea as track()).
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useCourseSearch(query) {
  throw new Error("TODO");
}
```

**What came back:**

A hook using `useEffect` and `useState`. It trims the query, returns to
the `idle` state without making a request for blank input, builds the
query string with `URLSearchParams`, and calls `apiFetch`. It uses
`[trimmedQuery]` as the effect dependency and an `ignore` flag in
cleanup so an older request cannot overwrite the latest search result.

**What I kept, and what I rejected:**

Kept the safe query-string construction, trimmed dependency, and cleanup
flag because they directly satisfy the prompt. The response also reset
results when a new search starts and on failure.

------------------------------------------------------------------------

## Prompt 7 --- implement useDebounced (stretch)

**Why I sent it:**

I wanted to complete the stretch task so that typing several characters
quickly would settle into one query update after the specified delay,
rather than triggering a search for every keystroke.

**Sent:**

``` jsx
// STRETCH (pre-lab section 06) — useDebounced(value, ms)
//
// Returns `value`, but only once it has stopped changing for `ms` milliseconds; until then,
// the previous settled value. Typing "learn" quickly then gives one change ("learn"), not
// five — so useCourseSearch sends one request, not five. JS Lab 2 §09's debounce, as a hook:
// a useState for the settled value, and a useEffect that starts a timer when `value`
// changes and whose cleanup cancels the previous timer (clearTimeout).
//
// Then use it in CourseSearch:  useCourseSearch(useDebounced(query, 250))
import { useEffect, useState } from "react";

export function useDebounced(value, ms) {
  throw new Error("TODO");
}
```

**What came back:**

A `useDebounced(value, ms)` hook that stores the settled value in state,
starts a `setTimeout` inside `useEffect`, and returns a cleanup function
that calls `clearTimeout`. The effect depends on `[value, ms]`. The
response also showed how to use the hook with a 250 ms delay in
`CourseSearch`.

**What I kept, and what I rejected:**

Kept the timer and cleanup pattern. The debounce hook remains a separate
stretch utility; it should only be connected to `CourseSearch` if the
stretch behaviour is intended.

------------------------------------------------------------------------

## Prompt 8 --- implement CourseSearch

**Why I sent it:**

The `CourseSearch` starter still displayed a placeholder. I needed a
controlled search input whose query state belongs to this component,
with the search hook and results view connected to it.

**Sent:**

``` jsx
// Pre-lab section 06 — a controlled input, and the pieces put together.
//
// CourseSearch: a search box, and what it finds.
//   - A heading "Search the catalogue".
//   - <label>Search courses</label> and an <input type="search"> that is CONTROLLED:
//     its value comes from state (query), and onChange puts what was typed into that state.
//   - useCourseSearch(query) does the fetching; SearchResults shows the outcome.
// This component owns the query (nobody else needs it) and nothing else.
import { useState } from "react";
import { useCourseSearch } from "./useCourseSearch.js";
import { SearchResults } from "./SearchResults.jsx";

export function CourseSearch() {
  // Replace this line with the search box (pre-lab section 06).
  return <p className="todo">The course search goes here — pre-lab section 06.</p>;
}
```

**What came back:**

A `CourseSearch` component with local `query` state, a controlled
`<input type="search">`, a label, and a heading. It passes the query to
`useCourseSearch` and passes the returned `results` and `status` to
`SearchResults`. The response also explained the optional change needed
to use `useDebounced(query, 250)`.

**What I kept, and what I rejected:**

Kept the controlled-input pattern and the separation between query
state, fetching, and rendering. The direct `useCourseSearch(query)` call
follows the pre-lab prompt; debounce is optional stretch functionality.

------------------------------------------------------------------------

## Afterwards

-   **How many prompts did the whole feature take?**\
    Eight prompts are recorded in this log: four for the Courses
    page/form implementation and four for the pre-lab search components
    and debounce stretch task.

-   **Which of your prompts would you write differently now, and how?**\
    I would make the fix prompts more explicit by naming the exact
    contract section, required props, expected behaviour, and
    restrictions. For the search component, I would state clearly
    whether I want the optional debounce hook connected or whether I
    want the basic pre-lab behaviour only.

-   **One thing the rules in Prompt 1 prevented (or failed to
    prevent):**\
    The rules constrained the implementation to the existing `apiFetch`
    client, the permitted React hooks, named exports, and a separate
    presentational View. They helped prevent introducing extra libraries
    or moving API logic into the View. However, the prompt alone did not
    prove that the implementation passed the project's tests; that still
    required running `npm test` and recording the actual result.
