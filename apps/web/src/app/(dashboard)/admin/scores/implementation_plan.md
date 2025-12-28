# Implementation Plan - Admin Results Dashboard (Phase 4)

## Goal

Implement a functional Admin Dashboard for managing PDF results at `/admin/scores`, strictly adhering to Phase 4 requirements and the existing backend implementation.

## User Review Required

> [!IMPORTANT] > **Blocking Corrections Aligned**:
>
> - **API Endpoints**: Will use existing backend paths:
>   - `POST /api/v1/results/upload` (for upload)
>   - `GET /api/v1/results` (for listing)
>   - `DELETE /api/v1/results/:id` (for deletion)
> - **Uploaded By**: Will be **removed** from the UI for Phase 4 to avoid unnecessary joins.
> - **Date Field**: Will be explicitly labeled **"Year"** (e.g., "2025") in the UI to match the simple data model.
> - **Scope**: Strictly **PDF Management** only. No structured scoring grids, no CSV imports, no complex filters.

## Proposed Changes

### Frontend (`apps/web`)

#### [MODIFY] [page.tsx](<file:///c:/Users/trite/Downloads/demowebsite/apps/web/src/app/(dashboard)/admin/scores/page.tsx>)

1.  **Remove Legacy/Mock UI**:

    - Delete the complex "Score Entry" data table.
    - Delete the "Validation Summary" widget.
    - Delete the "Competition & Event Selection" dropdowns.
    - Delete the drag-and-drop CSV upload widget.

2.  **Add Phase 4 UI (Government-Style)**:

    - **Header**: Simple title "Results Management".
    - **Upload Section**:
      - **Input**: Title (Text, required).
      - **Input**: Year (Number/Text, required, e.g., "2025").
      - **Input**: Description (Text, optional).
      - **Input**: File (File picker, accept `.pdf` only).
      - **Action**: "Upload Result" button (Primary).
    - **Results List**:
      - Simple HTML Table.
      - **Columns**: Year | Title | File Name | Size | Uploaded At | Actions.
      - **Actions**: "Download" (Link), "Delete" (Button with confirm).

3.  **Integration Logic**:
    - **Fetch**: On mount, call `GET /api/v1/results`.
    - **Upload**: On submit, call `POST /api/v1/results/upload` (FormData).
      - Handle loading state.
      - Handle success (refresh list, clear form).
      - Handle error (alert message).
    - **Delete**: On click, call `DELETE /api/v1/results/:id`.
      - Handle loading/optimistic update.

## UX Rules (Phase 4)

- **Visuals**: Clean, high-contrast, no animations.
- **Feedback**: Browser native alerts or simple text messages for success/error.
- **Access**: Page is already protected by Admin Layout (Phase 4 requirement met).

## Verification Plan

### Manual Verification Checklist

1.  **Access Control**: Verify accessing `/admin/scores` requires admin login.
2.  **Data Display**: Verify the table performs a `GET` request and renders rows.
3.  **Upload Flow**:
    - Enter "Test Result", Year "2025", Select valid PDF.
    - Click Upload.
    - Verify `POST /api/v1/results/upload` is called.
    - Verify table refreshes with new item.
4.  **Delete Flow**:
    - Click "Delete" on an item.
    - Verify `DELETE /api/v1/results/:id` is called.
    - Verify item is removed from table.
