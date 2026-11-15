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
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");

  const trimmedQuery = query.trim();

  useEffect(() => {
    let ignore = false;

    // Blank query: don't send an API request
    if (trimmedQuery === "") {
      setResults([]);
      setStatus("idle");

      return () => {
        ignore = true;
      };
    }

    async function searchCourses() {
      setStatus("loading");
      setResults([]);

      try {
        const params = new URLSearchParams({
          q: trimmedQuery,
        });

        const data = await apiFetch(
          `/api/courses?${params.toString()}`
        );

        if (!ignore) {
          setResults(data);
          setStatus("ready");
        }
      } catch (error) {
        if (!ignore) {
          setResults([]);
          setStatus("error");
        }
      }
    }

    searchCourses();

    // Ignore outdated responses
    return () => {
      ignore = true;
    };
  }, [trimmedQuery]);

  return {
    results,
    status,
  };
}

