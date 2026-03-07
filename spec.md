# Specification

## Summary
**Goal:** Add an availability status feature to Free Stuff posts in RoFree Hub.

**Planned changes:**
- Add an `isAvailable` boolean field (defaulting to `true`) to the free stuff post data model in the backend, along with a function to update it
- Update `FreeStuffPostCard` to display a colored availability badge ("Available" in green / "Unavailable" in red/gray)
- Add an "Available Only" filter toggle to `FreeStuffFeed` that filters posts by `isAvailable: true`
- Add an "Available" toggle (defaulting to checked) to `FreeStuffCreationForm`
- Update `useGetFreeStuffPosts` and `useCreateFreeStuffPost` hooks to include the `isAvailable` field, and add a new `useUpdateFreeStuffAvailability` mutation hook

**User-visible outcome:** Users can mark free stuff posts as available or unavailable when creating them, see a clear availability badge on each post card, and filter the feed to show only available items.
