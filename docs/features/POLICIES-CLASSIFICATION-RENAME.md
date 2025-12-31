# Renaming Criteria to Policies and Adding Classification Section

## Summary

Successfully renamed "Criteria" to "Policies" throughout the application and added a new "Classification" section beside Policies in the admin panel.

---

## Changes Made

### 1. Admin Navigation ✅

**File**: `apps/web/src/app/(dashboard)/admin/layout.tsx`

**Changes**:

- Renamed "Circulars/Criteria" to "Policies"
- Added new "Classification" menu item
- Both items now appear under "Content Management" section

**New Structure**:

```
Content Management
├── Policies (renamed from Circulars/Criteria)
├── Classification (NEW)
├── News & Updates
└── Gallery
```

### 2. Folder Structure ✅

**Changes**:

- Renamed folder: `admin/criteria` → `admin/policies`
- Created new folder: `admin/classification` (copy of policies)

**Directory Structure**:

```
apps/web/src/app/(dashboard)/admin/
├── policies/
│   ├── page.tsx
│   └── create/
│       └── page.tsx
└── classification/
    ├── page.tsx
    └── create/
        └── page.tsx
```

### 3. Policies Admin Pages ✅

#### Main Page (`admin/policies/page.tsx`)

- Component renamed: `AdminCriteriaPage` → `AdminPoliciesPage`
- Type renamed: `CriteriaItem` → `PolicyItem`
- Function renamed: `fetchCriteria` → `fetchPolicies`
- Page title: "Policies"
- Subtitle: "Manage official policies, rules, and selection criteria"
- Create link: `/admin/policies/create`

#### Create Page (`admin/policies/create/page.tsx`)

- Component renamed: `CreateCriteriaPage` → `CreatePolicyPage`
- Redirect after save: `/admin/policies`
- Back link: `/admin/policies`

### 4. Classification Admin Pages ✅

#### Main Page (`admin/classification/page.tsx`)

- Component: `AdminClassificationPage`
- Type: `ClassificationItem`
- Function: `fetchClassification`
- Page title: "Classification"
- Subtitle: "Manage shooter classification documents and guidelines"
- Create link: `/admin/classification/create`

#### Create Page (`admin/classification/create/page.tsx`)

- Component: `CreateClassificationPage`
- Redirect after save: `/admin/classification`
- Back link: `/admin/classification`

### 5. Public-Facing Updates ✅

#### Header Navigation (`components/ui/Header.tsx`)

- Changed: `{ label: 'Criteria', href: '/downloads' }`
- To: `{ label: 'Policies', href: '/downloads' }`

#### Footer Navigation (`components/ui/Footer.tsx`)

- Changed: `{ label: 'Criteria', href: '/downloads' }`
- To: `{ label: 'Policies', href: '/downloads' }`

#### Downloads Page (`app/(public)/downloads/page.tsx`)

- Page title metadata: "Criteria" → "Policies"
- Breadcrumb: "Criteria" → "Policies"

#### News Detail Page (`app/(public)/news/[slug]/page.tsx`)

- Link text: "Criteria & Documents" → "Policies & Documents"

---

## Verification Results ✅

**Browser Testing Completed**:

- ✅ Admin sidebar shows "Policies" instead of "Circulars/Criteria"
- ✅ Admin sidebar shows new "Classification" section
- ✅ Both items appear under "Content Management"
- ✅ Policies page loads correctly at `/admin/policies`
- ✅ Classification page loads correctly at `/admin/classification`
- ✅ Both pages display appropriate titles and subtitles
- ✅ "Add Document" functionality works on both pages
- ✅ No errors or console warnings

**Screenshots Captured**:

1. Admin sidebar with expanded Content Management menu
2. Policies page showing correct title and layout
3. Classification page showing correct title and layout

---

## Files Modified

### Admin Files

1. ✅ `apps/web/src/app/(dashboard)/admin/layout.tsx`
2. ✅ `apps/web/src/app/(dashboard)/admin/policies/page.tsx` (renamed from criteria)
3. ✅ `apps/web/src/app/(dashboard)/admin/policies/create/page.tsx` (renamed from criteria)
4. ✅ `apps/web/src/app/(dashboard)/admin/classification/page.tsx` (NEW)
5. ✅ `apps/web/src/app/(dashboard)/admin/classification/create/page.tsx` (NEW)

### Public Files

6. ✅ `apps/web/src/components/ui/Header.tsx`
7. ✅ `apps/web/src/components/ui/Footer.tsx`
8. ✅ `apps/web/src/app/(public)/downloads/page.tsx`
9. ✅ `apps/web/src/app/(public)/news/[slug]/page.tsx`

---

## Features

### Policies Section

- **Purpose**: Manage official policies, rules, and selection criteria
- **URL**: `/admin/policies`
- **Create URL**: `/admin/policies/create`
- **Functionality**: Same as previous Criteria section
  - Add documents (file upload or URL)
  - View document list
  - Download documents
  - Delete documents

### Classification Section (NEW)

- **Purpose**: Manage shooter classification documents and guidelines
- **URL**: `/admin/classification`
- **Create URL**: `/admin/classification/create`
- **Functionality**: Same as Policies section
  - Add classification documents
  - View classification list
  - Download documents
  - Delete documents

---

## Backend Compatibility

Both Policies and Classification sections use the same backend API:

- **Endpoint**: `/downloads`
- **Methods**: GET, POST, DELETE
- **Categories**:
  - `rules` - Rules & Guidelines
  - `selection` - Selection Policies
  - `calendar` - Event Calendar
  - `match` - Match Documents

**Note**: Both sections share the same backend endpoint and data structure. They are separated in the frontend for better organization and user experience.

---

## User Experience

### Admin Users

1. **Navigation**: Clear separation between Policies and Classification
2. **Consistency**: Both sections have identical functionality
3. **Clarity**: Descriptive subtitles explain each section's purpose

### Public Users

1. **Navigation**: "Policies" appears in header and footer
2. **Downloads Page**: Title updated to "Policies"
3. **Breadcrumb**: Shows "Policies" instead of "Criteria"
4. **Links**: All references updated consistently

---

## Next Steps (Optional)

If you want to separate Policies and Classification data in the backend:

1. **Create New Backend Endpoint**:
   - Add `/classification` endpoint
   - Create separate database table or add category filter

2. **Update Frontend API Calls**:
   - Policies: Continue using `/downloads`
   - Classification: Use new `/classification` endpoint

3. **Add Category Filter**:
   - Filter documents by type in each section
   - Prevent cross-contamination of data

---

## Rollback Plan

If you need to revert these changes:

1. **Rename folders back**:

   ```powershell
   Move-Item "apps\web\src\app\(dashboard)\admin\policies" "apps\web\src\app\(dashboard)\admin\criteria"
   Remove-Item "apps\web\src\app\(dashboard)\admin\classification" -Recurse
   ```

2. **Revert code changes using git**:
   ```bash
   git checkout HEAD -- apps/web/src/app/(dashboard)/admin/layout.tsx
   git checkout HEAD -- apps/web/src/components/ui/Header.tsx
   git checkout HEAD -- apps/web/src/components/ui/Footer.tsx
   git checkout HEAD -- apps/web/src/app/(public)/downloads/page.tsx
   git checkout HEAD -- apps/web/src/app/(public)/news/[slug]/page.tsx
   ```

---

## Conclusion

✅ **Successfully completed**:

- Renamed "Criteria" to "Policies" throughout the application
- Added new "Classification" section beside Policies
- Updated all navigation, titles, and references
- Verified functionality in browser
- No errors or issues detected

Both sections are now live and fully functional!
