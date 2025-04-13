# Dashboard Update Plan: Latest Community Topics

**Goal:** Update the "Latest Community Posts" section on the dashboard (`app/dashboard/page.tsx`) to show "Latest Community Topics" fetched from the database, using a similar approach to the main forum page (`components/ForumPageStatic.tsx`).

**Plan:**

1.  **Modify `app/dashboard/page.tsx`:**
    *   **Add State:** Introduce a new state variable, `latestTopics`, initialized as an empty array, to store the fetched forum topics.
    *   **Update Data Fetching (`useEffect`):**
        *   Modify the `useEffect` hook to include a Supabase query to fetch the latest topics from the `forum_topics` table.
        *   Select relevant fields: `id`, `slug`, `title`, `content`, `created_at`, `last_activity_at`, `author_id`.
        *   Order by `created_at` or `last_activity_at` descending.
        *   Limit results (e.g., 3 or 5).
        *   Store fetched topics in the `latestTopics` state. Handle errors.
    *   **Update Section Heading:** Change `t('Latest Community Posts')` to `t('Latest Community Topics')`.
    *   **Update Rendering Logic:**
        *   Remove mock post rendering code (`mockAurovillePosts`).
        *   Remove misplaced resource card rendering code.
        *   Add a loop mapping over `latestTopics`.
        *   Render `TopicItem` component for each topic, passing formatted props (especially `meta`).
    *   **Imports:** Add import for `TopicItem`. Define/import topic types.
    *   **Styling:** Use `TopicItem` styling initially, adjust if needed.

**Diagram:**

```mermaid
graph TD
    A[Start] --> B[Modify `app/dashboard/page.tsx`];
    B --> C{Add `latestTopics` state};
    B --> D{Update `useEffect` to fetch topics from `forum_topics` table};
    D --> E{Select fields, order by date, limit results};
    E --> F{Store fetched topics in state};
    B --> G{Change heading to "Latest Community Topics"};
    B --> H{Remove mock post rendering code};
    B --> I{Remove resource card rendering code};
    B --> J{Add loop to render `TopicItem` for each topic in `latestTopics` state};
    J --> K{Format data for `TopicItemProps`};
    B --> L{Import `TopicItem` component};
    L --> M[End Modification];