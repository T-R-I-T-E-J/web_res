# 🏗️ Feature Request: Latest News & Upcoming Events Integration

## Problem Description

### Current Behavior

The home page currently lacks dynamic integration for:

1. **Latest News** - No API connection to fetch and display recent news articles
2. **Upcoming Events** - No API connection to fetch and display scheduled events

The home page either shows static placeholder content or no content at all for these sections, preventing users from seeing real-time updates.

### Expected Behavior

- Home page should dynamically fetch and display the latest news articles from the News API
- Home page should dynamically fetch and display upcoming events from the Events API
- Each section should have a dedicated subpage for viewing all items
- Users should be able to click on individual news/event cards to view full details

### Why This Matters

**User Experience Impact:**

- Users cannot access important updates and announcements
- The platform appears incomplete and unprofessional
- Key information about competitions, training, and organizational updates is not visible

**Business Impact:**

- Reduces platform engagement and utility
- Fails to meet core communication requirements for the Para Shooting Committee
- Members miss critical event information

---

## Steps to Reproduce

1. Navigate to the home page (`/`)
2. Scroll to the "Latest News" section
3. Observe: No dynamic news content is displayed
4. Scroll to the "Upcoming Events" section
5. Observe: No dynamic event content is displayed
6. Attempt to click "View All News" or "View All Events"
7. Observe: Links are either broken or lead to empty pages

---

## Scope & Constraints

### IN Scope

✅ **Backend API Integration:**

- Connect home page to existing News API endpoints
- Connect home page to existing Events API endpoints (if implemented)
- Ensure proper error handling for API failures

✅ **Frontend Components:**

- Create/update Latest News section on home page
- Create/update Upcoming Events section on home page
- Implement news card components with proper styling
- Implement event card components with proper styling

✅ **Subpages:**

- Create `/news` page to display all news articles
- Create `/events` page to display all upcoming events
- Implement pagination or infinite scroll for both pages
- Create individual detail pages (`/news/[slug]` and `/events/[id]`)

✅ **Responsive Design:**

- Ensure all components work on mobile, tablet, and desktop
- Follow existing design system and UI/UX patterns

### OUT of Scope

❌ Creating new backend APIs (News API should already exist from Phase 5A)
❌ Admin dashboard modifications
❌ Authentication/authorization changes
❌ Email notifications for new news/events

### Assumptions & Dependencies

- **Dependency:** News API endpoints are already implemented and functional
- **Dependency:** Events API endpoints exist or will be created separately
- **Assumption:** Database already contains news and events tables with proper schema
- **Assumption:** Design mockups/wireframes for news and events sections are available or will follow existing patterns

---

## Acceptance Criteria

### Home Page Integration

- [ ] Latest News section displays 3-6 most recent news articles
- [ ] Each news card shows: title, excerpt, published date, and thumbnail (if available)
- [ ] "View All News" button/link navigates to `/news` page
- [ ] Upcoming Events section displays 3-6 upcoming events
- [ ] Each event card shows: title, date/time, location, and brief description
- [ ] "View All Events" button/link navigates to `/events` page
- [ ] Both sections handle loading states gracefully (skeleton loaders)
- [ ] Both sections handle empty states (no news/events available)
- [ ] Both sections handle API errors with user-friendly messages

### News Subpage (`/news`)

- [ ] Displays all published news articles in reverse chronological order
- [ ] Implements pagination (10-20 items per page) or infinite scroll
- [ ] Includes search/filter functionality (optional but recommended)
- [ ] Each news item is clickable and navigates to detail page
- [ ] Page is SEO-optimized with proper meta tags

### News Detail Page (`/news/[slug]`)

- [ ] Displays full news article content
- [ ] Shows publication date, author (if applicable), and category
- [ ] Includes social sharing buttons (optional)
- [ ] Has "Back to News" navigation
- [ ] Handles 404 for non-existent news articles

### Events Subpage (`/events`)

- [ ] Displays all upcoming events in chronological order
- [ ] Past events are either hidden or shown in a separate section
- [ ] Implements pagination or infinite scroll
- [ ] Includes filter by date range or event type (optional)
- [ ] Each event is clickable and navigates to detail page

### Events Detail Page (`/events/[id]`)

- [ ] Displays full event details (date, time, location, description)
- [ ] Shows registration link or contact information (if applicable)
- [ ] Includes calendar export functionality (optional)
- [ ] Has "Back to Events" navigation
- [ ] Handles 404 for non-existent events

### Technical Requirements

- [ ] All API calls use proper error handling and loading states
- [ ] Components are reusable and follow DRY principles
- [ ] Code follows existing project architecture and patterns
- [ ] TypeScript types are properly defined for all data structures
- [ ] Responsive design works on all screen sizes
- [ ] Accessibility standards are met (WCAG 2.1 AA)
- [ ] Unit tests are written for new components (if project has testing setup)

---

## Priority

**High** - This is core functionality for the platform's home page and directly impacts user engagement and information dissemination.

---

## Environment

- **Branch:** `main` (create feature branch: `feature/home-news-events-integration`)
- **Environment:** Local development → Preview → Production
- **Affected Areas:** Frontend (Next.js), Backend API integration
- **Browser/OS:** All modern browsers (Chrome, Firefox, Safari, Edge)

---

## Technical Notes

### Existing API Endpoints (Reference)

Based on Phase 5A implementation:

- `GET /api/v1/news` - List all news articles
- `GET /api/v1/news/:id` - Get news by ID
- `GET /api/v1/news/slug/:slug` - Get news by slug
- Similar endpoints should exist for events

### Suggested File Structure

```
apps/web/src/
├── app/
│   ├── news/
│   │   ├── page.tsx              # News listing page
│   │   └── [slug]/
│   │       └── page.tsx          # News detail page
│   ├── events/
│   │   ├── page.tsx              # Events listing page
│   │   └── [id]/
│   │       └── page.tsx          # Event detail page
│   └── page.tsx                  # Home page (update)
├── components/
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   ├── NewsList.tsx
│   │   └── NewsSection.tsx       # For home page
│   └── events/
│       ├── EventCard.tsx
│       ├── EventsList.tsx
│       └── EventsSection.tsx     # For home page
└── lib/
    └── api/
        ├── news.ts               # API client functions
        └── events.ts             # API client functions
```

---

## Related Issues

- Phase 5A: News & Announcements API Implementation
- Events API Implementation (if separate issue)

---

## Additional Context

This feature is essential for the Para Shooting Committee of India Digital Platform to serve as an effective communication hub for members, athletes, and stakeholders.

---

## Suggested Labels

`feature`, `frontend`, `backend-integration`, `high-priority`, `home-page`, `news`, `events`, `user-experience`, `phase-5`
