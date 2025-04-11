<!--
INSTRUCTION FOR AI/DEVELOPERS:
After you complete any task in this file, update the corresponding checkbox from [ ] to [x].
This file is the single source of truth for the current state of forum/web app development.
Always read and update this file before and after making changes.
-->

# Forum Improvement Task Tracker

## 1. Threaded Comments (parent_post_id)

- [x] **Database Migration**
  - [x] Add `parent_post_id` (nullable, FK to forum_posts.id) to `forum_posts` table.
  - [x] Create index on `parent_post_id`.
  - [x] Update Supabase schema and run migration.
- [x] **API Update**
  - [x] Update post creation endpoint to accept `parent_post_id`.
  - [x] Update post fetching endpoint to return `parent_post_id`.
  - [x] Update API docs/comments.
- [x] **Frontend Update**
  - [x] Update post creation UI to allow replying to specific posts.
  - [x] Refactor post rendering to use backend-provided thread structure.
  - [x] Test nested replies and UI edge cases.

---

## 2. Pagination for Posts

- [ ] **API**
  - [ ] Add `page` and `limit` query params to posts endpoint.
  - [ ] Implement pagination logic in SQL query.
  - [ ] Return pagination metadata (total, current page, etc.).
- [ ] **Frontend**
  - [ ] Add pagination controls (infinite scroll or "Load More").
  - [ ] Fetch and append posts as user scrolls or clicks.
  - [ ] Display loading and error states.
- [ ] **Performance**
  - [ ] Ensure indexes on `topic_id`, `created_at`, and `parent_post_id`.

---

## 3. Rich Content Support

- [ ] **Markdown**
  - [ ] Allow Markdown input in topic/post forms.
  - [ ] Render Markdown in topic/post display.
  - [ ] Sanitize/escape HTML for security.
- [ ] **Attachments (Optional)**
  - [ ] Create `forum_attachments` table.
  - [ ] Add file upload API.
  - [ ] Update UI to allow attaching files/images.
  - [ ] Display attachments in posts.

---

## 4. Topic Sorting, Pinning, and Activity

- [ ] **Database**
  - [ ] Add `is_pinned` (boolean) and `status` (string) to `forum_topics`.
  - [ ] Create index on `last_activity_at`.
- [ ] **API**
  - [ ] Update topic listing endpoint to support sorting (by activity, pinned, etc.).
  - [ ] Add support for filtering by status.
- [ ] **Frontend**
  - [ ] Display pinned topics at the top.
  - [ ] Add sorting/filtering controls for users.

---

## 5. Moderation, Notifications, and Analytics

- [ ] **Moderation**
  - [ ] Add `status` to `forum_posts` and `forum_topics` (e.g., active, hidden, locked).
  - [ ] Add moderator roles/permissions.
  - [ ] Implement reporting system (reports table, UI, and API).
- [ ] **Notifications**
  - [ ] Create `notifications` table.
  - [ ] Add backend logic to generate notifications (replies, mentions, etc.).
  - [ ] Add frontend notification UI.
- [ ] **Analytics**
  - [ ] Add `views` and `post_count` to `forum_topics`.
  - [ ] Track and display topic/post stats.
  - [ ] (Optional) Add analytics table for deeper insights.

---

## 6. Category and Tag Improvements

- [ ] **Categories**
  - [ ] Add `icon`, `is_restricted`, and `order` fields to `forum_categories`.
  - [ ] (Optional) Add `parent_category_id` for subcategories.
- [ ] **Tags**
  - [ ] Create `tags` and `forum_topic_tags` tables.
  - [ ] Update topic creation/editing to support tags.
  - [ ] Display tags in topic listings and pages.

---

## 7. User Experience Enhancements

- [ ] **Drafts**
  - [ ] Add drafts table or local storage support for unsent posts/topics.
  - [ ] UI for saving/restoring drafts.
- [ ] **Reactions**
  - [ ] Create `forum_post_reactions` table.
  - [ ] Add UI for liking/reacting to posts.
  - [ ] Display reaction counts.

---

## 8. Documentation & Testing

- [ ] Update API documentation for all new/changed endpoints.
- [ ] Add/expand automated tests for new features.
- [ ] Write migration/rollback instructions for DB changes.

---
