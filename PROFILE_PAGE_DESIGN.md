# Profile Page Design Document — Notes2Card

## Overview

A dedicated profile page at `/dashboard/profile` that gives users a clean overview of their account, study activity, and subscription status. The page uses a **tabbed layout** — the profile header stays fixed at the top, and the content below switches between 3 tabs.

Everything on this page is **already available** from existing database tables and the Clerk auth provider — no new tables, APIs, or complex features needed.

---

## Data Sources (what we already have)

| Data                         | Source                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| Full name, email, avatar     | Clerk `useUser()`                                                                        |
| Date joined                  | `USER_TABLE.dateJoined`                                                                  |
| Membership status            | `USER_TABLE.isMember`                                                                    |
| Stripe customer ID           | `USER_TABLE.customerId`                                                                  |
| Active plan (monthly/yearly) | `/api/user-status` route (already fetches from Stripe)                                   |
| All courses created by user  | `STUDY_MATERIAL_TABLE` filtered by `createBy` (already via `/api/courses`)               |
| Course details               | `STUDY_MATERIAL_TABLE`: `topic`, `courseType`, `diffcultyLevel`, `status`, `createdDate` |
| Credits used / remaining     | `courseCount` from existing context (free = 5, member = unlimited)                       |

---

## Page Structure

### Fixed Section: Profile Header Card (always visible above tabs)

A clean card at the top with the user's identity. This stays visible regardless of which tab is selected.

```
┌─────────────────────────────────────────────────┐
│  [Avatar]                                       │
│  John Doe                                       │
│  john@example.com                               │
│  Member since: 15/03/2025                       │
│  ┌──────────┐                                   │
│  │ Pro Plan  │  (or "Free Plan" badge)          │
│  └──────────┘                                   │
└─────────────────────────────────────────────────┘
```

**Data used:**

- `user.imageUrl` (Clerk avatar)
- `user.firstName`, `user.lastName`
- `user.emailAddresses[0]`
- `USER_TABLE.dateJoined` (via `/api/user-status`)
- `USER_TABLE.isMember` + `activePlan` (via `/api/user-status`)

---

## Tabs

The tab bar sits directly below the profile header. Three tabs:

```
┌──────────────┬──────────────┬──────────────┐
│  📊 Overview │  📚 Courses  │  ⚙️ Account  │
└──────────────┴──────────────┴──────────────┘
```

Active tab has a bold underline / highlight (primary color). Implemented with simple `useState` — no router changes, no extra libraries.

---

### Tab 1: Overview (default)

Shows quick stats and visual breakdowns of the user's study activity.

**Section A — Study Stats (4 cards)**

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  📚 Total    │ │  ✅ Ready    │ │  ⏳ In       │ │  🎯 Credits  │
│  Courses     │ │  Courses     │ │  Progress    │ │  Remaining   │
│     12       │ │     10       │ │      2       │ │    3 / 5     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

- Total courses = `courses.length`
- Ready courses = `courses.filter(c => c.status === 'Ready').length`
- Generating courses = `courses.filter(c => c.status === 'Generating').length`
- Credits = free users: `5 - courseCount` / members: "Unlimited"

**Section B — Course Type Breakdown + Difficulty Distribution (side by side)**

```
┌────────────────────────────┐ ┌────────────────────────────┐
│  Course Breakdown          │ │  Difficulty Levels         │
│                            │ │                            │
│  Exam         ████████  6  │ │  🟢 Easy   ●●●●●●●●  8   │
│  Practice     █████     4  │ │  🟡 Medium ●●●●      4   │
│  Interview    ███       2  │ │  🔴 Hard   ●●        2   │
│  Other        █         1  │ │                            │
└────────────────────────────┘ └────────────────────────────┘
```

- Group `courses` by `courseType` → colored horizontal bars.
- Group `courses` by `diffcultyLevel` → colored dots/bars.
- No chart library — just Tailwind widths.

---

### Tab 2: Courses

Shows all of the user's courses in a clean list with sorting.

```
┌─────────────────────────────────────────────────────────┐
│  All Courses (12)                                       │
│                                                         │
│  📖 Java Fundamentals     Exam     Easy   ✅  12/01/26 │
│  📖 React Hooks           Practice Medium ✅  10/01/26 │
│  📖 SQL Basics            Exam     Easy   ⏳  09/01/26 │
│  📖 Python OOP            Practice Hard   ✅  05/01/26 │
│  📖 Data Structures       Exam     Medium ✅  01/01/26 │
│  📖 System Design         Interview Hard  ✅  28/12/25 │
│  ...                                                    │
│                                                         │
│            [View on Dashboard →]                        │
└─────────────────────────────────────────────────────────┘
```

**Data used:**

- `courses` sorted by `createdDate` desc (full list, not sliced).
- Each row: `topic`, `courseType`, `diffcultyLevel`, `status`, `createdDate`.
- Each row links to `/course/{courseId}`.
- Status shown as a colored badge (green = Ready, yellow = Generating).

---

### Tab 3: Account

Manages subscription and shows account info.

```
┌─────────────────────────────────────────────────────────┐
│  Subscription                                           │
│                                                         │
│  Current Plan:  Pro (Monthly)    ← or "Free"            │
│  Status:        Active           ← or "—"               │
│  Credits:       Unlimited        ← or "3 / 5 remaining" │
│                                                         │
│  ┌─────────────────────┐                                │
│  │ Manage Subscription  │   (if member → Stripe portal) │
│  └─────────────────────┘                                │
│  ┌─────────────────────┐                                │
│  │   Upgrade to Pro     │   (if free user → upgrade pg) │
│  └─────────────────────┘                                │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Manage Account                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                   │   │
│  │   Clerk <UserProfile /> embedded component        │   │
│  │   (name, email, password, sessions, avatar)       │   │
│  │                                                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Data used:**

- `isMember`, `activePlan` to show current plan details.
- Manage Subscription → existing `/api/payment/manage-payment` → Stripe billing portal.
- Upgrade → link to `/dashboard/upgrade`.
- Clerk `<UserProfile />` component for account management (name, email, password, sessions). Styled with `appearance` prop to match app theme.

---

## Full Page Layout (wireframe)

```
┌─────────────────────────────────────────────────────────┐
│                   DashboardHeader                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Profile Header Card                    │  │
│  │    [Avatar]  Name  •  Email  •  Plan Badge        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────┬──────────────┬──────────────┐         │
│  │  📊 Overview │  📚 Courses  │  ⚙️ Account  │         │
│  └──────────────┴──────────────┴──────────────┘         │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │         (Tab content renders here)                │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Technical Plan

### File Structure

```
app/dashboard/profile/
  page.jsx                  ← Main profile page with tab state
  _components/
    ProfileHeader.jsx       ← Avatar, name, email, plan badge (always visible)
    ProfileTabs.jsx         ← Tab bar component (Overview | Courses | Account)
    OverviewTab.jsx         ← Stats + breakdowns (default tab)
    CoursesTab.jsx          ← Full course list
    AccountTab.jsx          ← Subscription info + action buttons
    StatCard.jsx            ← Reusable stat card (used in OverviewTab)
    CourseTypeBreakdown.jsx ← Horizontal bar chart by courseType
    DifficultyChart.jsx     ← Difficulty level distribution
```

### Tab Implementation

- Simple `useState('overview')` in `page.jsx`.
- `ProfileTabs` renders 3 buttons, highlights the active one.
- Conditionally render `<OverviewTab />`, `<CoursesTab />`, or `<AccountTab />` based on state.
- No routing needed — purely client-side tab switching.

### API Calls Needed (all existing)

1. `POST /api/user-status` — get `isMember`, `activePlan`, `dateJoined`
2. `POST /api/courses` — get all user courses (for stats + course list)

**No new API routes or database changes required.**

### Key Implementation Notes

- Uses Clerk's `useUser()` for avatar, name, email.
- All stats computed client-side from the courses array.
- Data is fetched once in `page.jsx` and passed down to all tabs as props (no duplicate API calls when switching tabs).
- Responsive design: stats grid is 2×2 on mobile, 4×1 on desktop. Breakdown charts stack on mobile. Tab bar scrolls horizontally on very small screens.
- Uses existing UI components: `Button`, `Badge`, `Card`, `Progress`.
- Add "Profile" link in `DashboardHeader` nav (replace existing HoverCard popup with a link to `/dashboard/profile`).

### Styling

- Tab bar: underline style, primary color for active tab, gray for inactive.
- Consistent with existing dashboard aesthetic (white cards, rounded corners, subtle shadows).
- Plan badge: green for Pro (monthly/yearly), gray for Free.
- Difficulty colors: green (Easy), yellow (Medium), red (Hard).
- Course type bars: use indigo/primary color with varying widths.

---

## What's NOT included (to keep it simple)

- No editable profile fields (Clerk manages that)
- No profile picture upload (Clerk handles avatars)
- No activity timeline or history log
- No chart library (just Tailwind-styled bars)
- No new database tables or migrations
- No settings or preferences page
- No tab routing library (just useState)

---

## Summary

| Section                              | Complexity | New Code Needed                |
| ------------------------------------ | ---------- | ------------------------------ |
| Profile Header (always visible)      | Low        | 1 component                    |
| Tab Bar                              | Low        | 1 component                    |
| Overview Tab (stats + charts)        | Low        | 1 component + 3 sub-components |
| Courses Tab (full list)              | Low        | 1 component                    |
| Account Tab (subscription + actions) | Low        | 1 component                    |
| Main Page (tab state + data fetch)   | Low        | 1 page file                    |
| Header Nav Update                    | Trivial    | Edit existing file             |

**Total: ~9 new files, 1 edit. All data from existing APIs. No backend changes.**
