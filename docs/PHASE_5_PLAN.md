# Phase 5: Core Features Implementation Plan

**Status:** Planned  
**Start Date:** 2025-12-27

---

## 🎯 Objective

Implement the core business domain of the Para Shooting Platform, specifically focusing on Shooter Profiles, Reference Data, and Competition Management.

## 📦 Phase 5 Roadmap

### Step 1: Reference Data Modules (✅ COMPLETE)

Implement the foundational data structures required for other modules.

- [x] **State Associations**: Entity, CRUD for States/Units.
- [x] **Disability Categories**: Entity, CRUD for WSPS categories.
- [x] **Venues**: Entity, CRUD for Shooting Ranges.

### Step 2: Shooter Management (🚀 IN PROGRESS)

Implement the core athlete profile system.

- [x] **Shooter Profile**: `Shooter` entity linked to `User`.
- [x] **Shooter Classification**: `ShooterClassification` entity and classifier workflows.
- [x] **Profile Completion Flow**: APIs for users to complete their shooter profile.
- [ ] **Document Management**: Handling medical and classification documents.

### Step 3: Event & Competition Structure

Define the sporting events.

- [ ] **Event Categories**: Rifle, Pistol, Shotgun.
- [ ] **Shooting Events**: 10m Air Rifle Standing SH1, etc.
- [ ] **Competitions**: Management of Championships and Trials.

### Step 4: Competition Operations

Manage the lifecycle of a competition.

- [ ] **Competition Events**: Linking events to competitions.
- [ ] **Entries/Registration**: Shooters registering for events.
- [ ] **Squadding**: Assigning shooters to details/lanes (if in scope).

---

## 🚀 Immediate Next Steps (Phase 5, Step 1)

**Goal:** Implement `StateAssociations` and `DisabilityCategories` to unblock `Shooters`.

1.  **Generate Module**: `nest g module states`
2.  **Create Entity**: `StateAssociation` (linked to `public.state_associations` table)
3.  **Create Repository/Service**: Standard CRUD.
4.  **Create Controller**: Admin-only write, Public read.
5.  **Repeat for Disability Categories**.

---

## 🛠Dependencies & shared implementations

- Use the `abstract.entity.ts` pattern if applicable (though we haven't strictly defined one yet, we should consistent with `User` entity).
- Reuse `AuditInterceptor` for all administrative actions.
- Use `PermissionsGuard` with `ref-data:read`, `ref-data:write` permissions (or similar).

---
