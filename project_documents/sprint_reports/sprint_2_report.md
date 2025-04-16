# Sprint 2 Report

**Video Link:**
https://youtu.be/jEB7HrnCbx4

## What's New (User Facing)

- New 'Reviews' Table to handle user reviews
- Create Game Rating
- Write Game Review
- Manage User Reviews
- View User Ratings
- View Game Reviews and Ratings


## Work Summary (Developer Facing)

This sprint focused on implementing the user review and rating system for games. A new Reviews table was added to the database to store structured feedback. Core functionality included creating and submitting game ratings, writing detailed game reviews, and managing user-submitted reviews. On the frontend, users can now view both individual game reviews and aggregate ratings, as well as their own submitted ratings and reviews. This update lays the groundwork for richer user interaction and community feedback features.

## Unfinished Work

Everything planned for this Sprint was completed

## Completed Issues/User Stories

- [Create A Review Table](https://github.com/luwke1/crowdplay-social/issues/11)
- [Create A Game Rating Review](https://github.com/luwke1/crowdplay-social/issues/12)
- [Delete Game Reviews/Ratings](https://github.com/luwke1/crowdplay-social/issues/14)
- [Update Game Ratings/Reviews](https://github.com/luwke1/crowdplay-social/issues/15)
- [View Profile Reviews/Ratings](https://github.com/luwke1/crowdplay-social/issues/16)
- [View a Games Reviews/Ratings](https://github.com/luwke1/crowdplay-social/issues/17)
- [Write Game Review Text and Post](https://github.com/luwke1/crowdplay-social/issues/13)

## Code Files for Review

Please review the following code files, which were actively developed during this sprint, for quality:

- [src/app/profile/page.tsx (User Profiles Display Reviews)](https://github.com/luwke1/crowdplay-social/blob/main/src/app/profile/page.tsx)
- [src/app/profile/game/[id]/page.tsx (Frontend for adding reviews to the Review Table)](https://github.com/luwke1/crowdplay-social/blob/main/src/app/game/%5Bid%5D/page.tsx)
- [src/app/api/auth.ts (API calls for pulling authentication information from database)](https://github.com/luwke1/crowdplay-social/blob/main/src/app/api/auth.ts)
- [src/app/api/reviews.ts (API for pulling review data from database)](https://github.com/luwke1/crowdplay-social/blob/main/src/app/api/reviews.ts)

## Retrospective Summary

### **Here's what went well:**

- Successfully integrated a new Reviews table to existing relational database
- Created API functions to read, add, and manage data in the database.
- Developed a frontend to allow users to create and write their own game reviews
- Created a nice frontend to allow users to view all their reviews
- Developed a nice frontend to allow users to view all existing game reviews


### **Here's what I'd like to improve:**

- More structured testing during development to catch bugs earlier.

---

This sprint set a strong foundation for Crowdplay-Social, and the next sprint will focus on enhancing the user experience with more social features like adding friends and viewing friend profiles.
