# The Canonical Design System — A SPA Template

**A design foundation for building deliberate interfaces instead of shipping AI slop.**

The Canonical Design System is a reusable starting point for administrative web applications and internal tools. It exists to make good interface decisions repeatable: establish a coherent visual language and shared components once, then adapt them thoughtfully to each product's users, workflows, and identity.

AI can help with implementation, but generated output is not a substitute for design judgment. The goal is not to ban AI-assisted development; it is to avoid generic, interchangeable interfaces that look plausible at a glance but lack consistency, context, and refinement.

> **Project status:** Work in progress. The current home page contains placeholder dashboard metrics and content. This repository is a foundation to develop, not a finished production-ready design system.

## Principles

- **Intentional design over defaults.** Layout, hierarchy, spacing, typography, color, and interaction should serve a clear purpose rather than simply reproduce familiar dashboard patterns.
- **Consistency without sameness.** Shared components and design tokens provide a coherent foundation, while each application can retain an identity suited to its context.
- **Reuse with judgment.** Reusable patterns reduce repetitive implementation work, but should not force every product into the same structure when its workflow calls for something different.
- **Refinement over output volume.** A working screen is only a starting point. Details, accessibility, responsive behavior, and real user workflows still need deliberate review.
- **AI as a tool, not an art director.** AI-assisted coding can accelerate implementation, but the result must be evaluated, edited, and owned by a human with clear product and design intent.

## Current foundation

- Shared application layout for dashboard pages.
- Header with search field, notifications, and user-profile area.
- Breadcrumb navigation generated from the current route.
- Dashboard page scaffold with example metric cards.
- Tailwind CSS styling and Sass support.
- Reusable React components built with Next.js App Router.
- Lucide icons and Geist fonts.

These elements are the initial scaffold, not proof that every interaction or design-system convention is complete. Search, notification, and profile elements are currently UI scaffolding and should not be assumed to be connected to backend services.

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

The repository also includes additional starting points under `base/` (`neumann-platform` and `saneagest`). The instructions above describe the root application scaffold; review each nested project before using it as the basis for a separate application.

## Customization

When adapting the foundation to a new application:

1. Understand the users, tasks, and constraints before choosing a page structure.
2. Adapt the shared layout and navigation to the system's actual workflow.
3. Define and reuse design tokens for color, spacing, typography, borders, and states.
4. Replace sample metrics and placeholder content with real application-specific information.
5. Check responsive behavior, accessibility, hierarchy, and interaction states.
6. Connect controls to real behavior before deployment.
7. Review generated or copied UI critically; remove patterns that are generic, inconsistent, unnecessary, or unsupported by the product's needs.

The aim is to make considered design easier to repeat—not to make every application look identical or to disguise unfinished work as a complete design system.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the application for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## License

No license has been specified yet. Check with the repository owner before reusing or distributing this project.
