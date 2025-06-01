# Crowdplay-Social

Crowdplay-Social is a social platform for gamers to review, share, and discover games. The platform allows users to connect with friends, track their play history, and receive personalized game recommendations.

## Features

- **User Authentication**: Implemented using Supabase for secure sign-up, login, and session management.
- **Game Discovery**: Integration with the IGDB API to fetch popular games, ratings, and reviews.
- **User Reviews**: Users can rate and review games, with their data stored in a PostgreSQL database.
- **Game Tracking**: Users can manage and view their reviewed games and ratings.
- **Friend System**: Basic social functionality allowing users to connect with friends.
- **Responsive UI**: Built using Next.js, TailwindCSS, and React.

## Tech Stack

- **Frontend**: Next.js (React 19, TypeScript, TailwindCSS)
- **Backend**: Supabase (PostgreSQL, authentication, storage)
- **API Integration**: IGDB API (game data), Axios for API requests
- **State Management**: React Hooks, Context API
- **ESLint & TypeScript**: Ensures clean and maintainable code

## Skills Demonstrated

- **User Authentication & Authorization**: Login and session handling with Supabase.
- **Backend Database Design**: Structured relational database using PostgreSQL.
- **Next.js & Server-Side Rendering**: Optimized page loading and SEO-friendly architecture.
- **REST API Handling**: Fetching and managing game data from IGDB.
- **Frontend Development**: Component-based architecture with React and TailwindCSS.
- **State Management**: Managing application state efficiently with React hooks.
- **Error Handling & Debugging**: Implemented error-catching mechanisms for API requests and authentication workflows.

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/luwke1/crowdplay-social.git
   ```
2. Install dependencies:
   ```bash
   cd crowdplay-social
   npm install
   ```
3. Set up environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   IGDB_CLIENT_ID=your_igdb_client_id
   IGDB_CLIENT_SECRET=your_igdb_client_secret
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Future Improvements

- Advanced friend system with game recommendations based on friends' reviews.
- Enhanced game discovery filters.
- Dark mode and accessibility improvements.
- Mobile-first UI improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
