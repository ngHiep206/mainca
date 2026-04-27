# PlayWise Security Specification

## 1. Data Invariants
- A `ChildProfile` must always be owned by the `parentId` (the logged-in user).
- A `Milestone` can only exist under a `ChildProfile` that the user owns.
- `Milestones` must denormalize the `parentId` to allow secure list queries.
- `Toys` are read-only for public users, writeable only by `admins`.
- `ConsultationRequest` must store the requester's `userId`.
- Users cannot change their `role` to `admin` by themselves.

## 2. The Dirty Dozen Payloads (Targeting Rejection)

1. **Identity Spoofing**: User A tries to create a `child` with `parentId: "UserB"`.
   ```json
   { "parentId": "UserB", "name": "Hackling", "birthDate": "2024-01-01" }
   ```
2. **Path Injection**: Creating a milestone with a 1MB string as ID.
   - `doc(db, "children", "childId", "milestones", "A".repeat(1024*1024))`
3. **Admin Privilege Escalation**: User tries to update their own profile to `role: "admin"`.
   ```json
   { "role": "admin" }
   ```
4. **Invalid Type Injection**: Setting a `toy` price to a string.
   ```json
   { "price": "cheap" }
   ```
5. **Orphaned Milestone**: Creating a milestone for a non-existent child.
   - Requires `get(/databases/$(database)/documents/children/$(childId))` to fail.
6. **State Shortcut**: Setting `ConsultationRequest` status directly to `completed` on create.
   ```json
   { "status": "completed", "message": "Quick skip" }
   ```
7. **Negative Values**: Setting `ageRangeMin` to `-5`.
8. **Resource Exhaustion**: Sending a description with 10MB of text.
9. **Tampering with Immutable**: Updating `createdAt` on a toy.
10. **Shadow Field**: Adding `isHacked: true` to a user profile.
11. **Email Verification Bypass**: Accessing private data when `email_verified` is `false` (if enforced).
12. **Public Write on Admin Data**: Anonymous user trying to create a `toy`.

## 3. Test Runner (Draft)
Verification will be handled via the logic in `firestore.rules`.
