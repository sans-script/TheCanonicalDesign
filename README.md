# The Canonical Design System

A reusable **Next.js dashboard template** intended to provide a consistent starting point for internal tools and administrative web applications. The goal is to speed up the creation of new systems by reusing a shared layout and adapting each project's visual identity, navigation, and page content instead of rebuilding the interface from scratch.

> **Project status:** Work in progress. The current home page contains placeholder dashboard metrics and content; this repository is a foundation to extend, not a finished production-ready design system.

## Current foundation

- Shared application layout for dashboard pages.
- Header with search field, notifications, and user-profile area.
- Breadcrumb navigation generated from the current route.
- Dashboard page scaffold with example metric cards.
- Tailwind CSS styling and Sass support.
- Reusable React components built with Next.js App Router.
- Lucide icons and Geist fonts.

## Technology stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Sass](https://sass-lang.com/)
- [Lucide](https://lucide.dev/) icons

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version
- npm (or another supported package manager)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app reloads as you edit the source files.

### Create a production build

```bash
npm run build
npm run start
```

## Project structure

```text
app/
  layout.tsx       # Root layout, metadata, fonts, and shared application shell
  page.tsx         # Example dashboard page
components/
  Breadcrumb/      # Route-based breadcrumb navigation
  Header/          # Search, notifications, and profile controls
  Layout/          # Shared application layout
```

## Customization

Use this repository as a starting point for a new application:

1. Adapt the shared layout and navigation to the system's workflow.
2. Define reusable components and consistent design tokens for colors, spacing, typography, and borders.
3. Replace the sample dashboard metrics and placeholder content with real application pages.
4. Update the metadata, labels, and visual identity for the target project.
5. Connect interactive controls to actual application behavior before deploying.

The current search, notification, and profile elements are UI scaffolding; they should not be assumed to be connected to backend services.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the application for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Design direction

The project is intended to support consistent, maintainable interfaces across multiple administrative systems while allowing each application to have its own identity. Shared patterns should reduce repeated implementation work without preventing individual systems from meeting their specific needs.

## License

No license has been specified yet. Check with the repository owner before reusing or distributing this project.
