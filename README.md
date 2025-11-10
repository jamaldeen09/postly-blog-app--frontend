# Postly Blog Platform

A modern, React + Redux Toolkit blog platform with comment interactions, like/unlike functionality, and archive management. Built with Next.js, TypeScript, and Tailwind CSS for scalable and maintainable frontend architecture.

## Features

- **User Authentication**: Sign up, login, and maintain session state.
- **Blog Posts**: Create, read, update, delete (CRUD) functionality.
- **Comments**: Add comments with real-time like/unlike functionality.
- **Archive Posts**: Move posts to archive with confirmation modal.
- **State Management**: Redux Toolkit for managing global state efficiently.
- **API Handling**: RTK Query for fetching and mutating data.
- **Responsive UI**: Tailwind CSS ensures responsive layouts across devices.
- **Skeleton Loaders**: Smooth loading experience using React skeleton components.
- **Dynamic URL Pagination**: Switch between archived, liked, and created posts with seamless URL updates.

## Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit, RTK Query
- **UI Components**: Lucide Icons, Tailwind UI
- **Utilities**: Custom hooks, helper functions (e.g., `formatTimeAgo`)
- **Optional**: SCSS for custom styling (if used)

## Key Components
- CommentItem: Displays individual comment with author, time, content, likes, and like button.
- CommentItemSkeleton: Skeleton loader while comments fetch from the server.
- ArchivePostConfirmation: Modal for confirming post archival, updates Redux state, and updates URL params. 

## Notes
- Liking/unliking comments is optimistically updated with a loading spinner while the API request is in progress.
- URL pagination logic is handled for archived, liked, and created posts.
- Time formatting is dynamic (just now, 5m ago, 2h ago, etc.) using formatTimeAgo.

## Contributing
 - Fork the repo
 - Create a feature branch (git checkout -b feature-name)
 - Commit your changes (git commit -m 'Add feature')
 - Push to branch (git push origin feature-name)
 - Open a Pull Request

## Usage
1. Clone the repo:
```bash
git clone <repo-url>
cd postly

