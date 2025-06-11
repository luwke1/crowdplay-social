# Crowdplay

Crowdplay is a web app where you can browse games, write reviews, get personalized recommendations, and follow other players. I built it to practice full-stack development and see how AI could make recommendations feel more personal.


---

## Core features

|             | What it does | Key tech |
|-------------|--------------|----------|
| **Discover** | Browse popular and latest games or search titles with dynamic pagination | IGDB API (via Twitch OAuth), custom Next.js API routes, REST APIs |
| **Rate & Review** | 1–10 rating with optional text; supports upsert, delete, and real-time update in UI | Supabase reviews table with RLS, React state syncing |
| **Follow users** | Follow/unfollow users, view follower/following counts, and conditional buttons | Supabase followers table, custom API layer, RLS |
| **AI Recommendations** | Enter a prompt (optionally using your review history) to get 10 curated games | Google Gemini 2 Flash API, custom prompt engine, dynamic IGDB lookups |
| **User profiles** | View your own or others' review history, with rating badges, covers, and pagination | Supabase queries, React pagination state, protected routes |
| **Authentication** | Email/password login with persisted sessions and route guarding | Supabase Auth, ProtectedRoute wrapper |

---

## Skills demonstrated

- **Full-stack TypeScript**: Next.js API routes & Supabase RPCs for game, review, and AI workflows.
- **Database design**: PostgreSQL schemas with composite keys and Supabase RLS.
- **Supabase Auth & CRUD**: Email/password signup, session handling, review & follow mutations.
- **API integration**: IGDB game data and Google Gemini 2 Flash recommendations.
- **State & auth control**: React Context, Hooks, and ProtectedRoute for guarded pages.
- **Responsive UI**: CSS and custom components (game cards, ratings) for dark-mode/mobile.
- **TypeScript & error handling**: Strict types, try/catch in API calls, typed interfaces.
- **Project organization**: Clear folder structure and Git feature-branch workflow.

---

## Screenshots
![Recommendations](https://github.com/user-attachments/assets/4aabe019-291d-47c9-904a-e9bb3543ae87)
This page allows the user to generate recommendations, that can also be tailored to their reviews and ratings. The user also has the option to type in a prompt, such as "games set in the future," and using GeminiAPI, Internet Game Database API, and user review data, it can generate new video game recommendations. 

This is connected to IGDB API to pull in their proper game covers and allow users to view the games public reviews and information. 


![Dashboard](https://github.com/user-attachments/assets/6e9285d5-c95b-42d1-88c1-37d863d0d471)
The main home page the user sees when they first login. They can browse games with search, or load more popular and latest games.

![Search](https://github.com/user-attachments/assets/a84558c9-41ba-416c-bd04-079d862555ef)
Users can search for games using the search bar in the header. It will display relevant games found in the IGDB database based on your query.

![Profile](https://github.com/user-attachments/assets/a9f6d25b-133d-4094-a9af-8212b707a6aa)
A user can visit their profile or another users and view all of their reviewed movies, and also how many followers/following they have. Users can also hover over a game card and remove ratings and reviews from their account.

![GameDetails](https://github.com/user-attachments/assets/1133506b-d756-412f-945f-1de960d75deb)
When a game is clicked, it brings up the game details and displays all the written reviews for the game. It also gives the user the option to leave their own rating and written review. This all interacts with the backend database created in Supabase.

---

## License

MIT
