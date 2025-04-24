# Sprint 3 Report

**Video Link:**  
https://youtu.be/YOUR_NEW_VIDEO_LINK_HERE

## What's New (User Facing)

- View other users’ profiles (FrontEnd Development)
- Follow other users
- Unfollow users
- Display follower and following counts on profiles

## Work Summary (Developer Facing)

This sprint focused on introducing social connectivity to CrowdPlay. We implemented the ability to view public profiles of other users and initiate follow or unfollow actions. The frontend was updated to display correct follower and following counts dynamically, reinforcing the social structure of the app. Backend endpoints were created to support these features, and UI components were added for profile views and follow buttons. These new capabilities pave the way for deeper community interaction and network-based recommendations in future iterations.

## Unfinished Work

- Minor UI polishing for profile layouts and follow/unfollow animations will be addressed next sprint.

## Completed Issues/User Stories

- [View Other User Profiles](https://github.com/luwke1/crowdplay-social/issues/19)
- [Follow User](https://github.com/luwke1/crowdplay-social/issues/20)
- [Unfollow User](https://github.com/luwke1/crowdplay-social/issues/21)
- [Get Profile Details](https://github.com/luwke1/crowdplay-social/issues/22)
- [Display Follower/Following Count](https://github.com/luwke1/crowdplay-social/issues/24)

## Code Files for Review

Please review the following code files, which were actively developed during this sprint, for quality:

- [src/app/[username]/reviews (Frontend for displaying user profile data)](https://github.com/luwke1/crowdplay-social/blob/main/src/app/%5Busername%5D/reviews/page.tsx)
- [src/app/api/follow.ts (API for handling follow/unfollow actions)](https://github.com/luwke1/crowdplay-social/blob/main/src/app/api/follow.ts)
- [src/app/api/reviews.ts (API for fetching user profile data)](https://github.com/luwke1/crowdplay-social/blob/main/src/app/api/reviews.ts)
- [src/app/api/users.ts (API for collecting user info and details)](https://github.com/luwke1/crowdplay-social/blob/main/src/app/api/auth.ts)

## Retrospective Summary

### **Here's what went well:**

- Implemented smooth profile viewing and navigation system
- Successfully created and connected follow/unfollow backend logic
- Dynamic counts for followers and following are responsive and accurate
- Clean UI and intuitive interaction for social features

### **Here's what I'd like to improve:**

- Expand on follower interactions (e.g., activity feed, suggested follows)
- Consider debounce and optimistic UI improvements for smoother follow/unfollow transitions

---

This sprint strengthened Crowdplay’s core social features and sets the stage for integrating friend-based recommendations and activity tracking in future sprints.
