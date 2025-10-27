# Micro-Frontend Architecture POC

A practical demonstration of micro-frontend architecture using React, showcasing how independent applications can work together while maintaining autonomy.

## What This Project Does

This is a proof-of-concept that shows how to build scalable front-end applications using a micro-frontend approach. Instead of one large monolithic app, we have three independent applications:

- **Host Application** - Main dashboard and design system showcase
- **Chat Application** - Messaging interface with conversations
- **Email Application** - Email client with inbox and compose features

Each application runs independently and can be developed, tested, and deployed separately.

## Quick Start

```bash
# Install dependencies
npm run install:all

# Start all applications
npm run dev
```

Open http://localhost:5174 in your browser. You'll see the host application with buttons to open the chat and email apps.

## Architecture Overview

The project uses a simple but effective micro-frontend pattern:

```
Host App (5174)
├── Design System
├── Shared Components
└── Links to micro-frontends
    ├── Chat App (5175)
    └── Email App (5176)
```

Each application:
- Runs on its own port
- Can be deployed independently
- Uses the same design system for consistency
- Maintains its own state and logic

## Why This Approach?

### Benefits

**Independence** - Each team can work on their app without blocking others. Deploy chat updates without touching email.

**Scalability** - Need a new feature? Create a new micro-frontend. The architecture scales horizontally.

**Technology Flexibility** - While all apps here use React, each could theoretically use different frameworks or versions.

**Resilience** - If one app has issues, others continue working. No single point of failure.

### Trade-offs

**Complexity** - More moving parts to manage compared to a monolith.

**Code Duplication** - Design system is currently copied to each app for POC simplicity. In production, this would be a shared npm package.

**Initial Setup** - Takes more time upfront to set up the architecture.

> **Note on Design System:** Currently, the design system is copied to `host/`, `chat/`, and `email/` apps. This was intentional for the POC to avoid deployment complexity. In a production environment, the design system would be published as a scoped npm package (`@company/design-system`) that all micro-frontends import, ensuring a true single source of truth.

## Project Structure

```
├── host/                    # Main application (Port 5174)
│   ├── src/
│   │   ├── designSystem/   # Shared UI components
│   │   │   ├── components/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Badge.jsx
│   │   │   └── styles.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── chat/                    # Chat micro-frontend (Port 5175)
│   ├── src/
│   │   ├── designSystem/   # Copy of design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
└── email/                   # Email micro-frontend (Port 5176)
    ├── src/
    │   ├── designSystem/   # Copy of design system
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

## Design System

All apps use a shared design system to maintain visual consistency. The system includes:

**Components:**
- Button (5 variants: primary, secondary, success, danger, outline)
- Card (container with optional header/footer)
- Input (text fields with label and error states)
- Badge (status indicators)

**Design Tokens:**
- Color palette (primary, secondary, success, danger, warning, grays)
- Spacing scale (xs to 2xl)
- Typography system
- Border radius values
- Shadow depths

The design system uses CSS custom properties, making it easy to theme and customize.

## Running the Applications

### All Together (Recommended)

```bash
npm run dev
```

This starts all three applications using concurrently. You'll see color-coded output:
- Blue: Host (5174)
- Green: Chat (5175)
- Magenta: Email (5176)

### Individually

If you prefer separate terminals:

```bash
# Terminal 1
npm run dev:host

# Terminal 2
npm run dev:chat

# Terminal 3
npm run dev:email
```

## Building for Production

```bash
# Build all apps
npm run build

# Or individually
npm run build:host
npm run build:chat
npm run build:email
```

Each app outputs to its own `dist/` folder.

## Deployment

The easiest way to deploy is using Vercel:

1. Push your code to GitHub (one repository)
2. Create three Vercel projects:
   - Project 1: Root directory = `host`
   - Project 2: Root directory = `chat`
   - Project 3: Root directory = `email`

Each app gets its own URL. Update the button URLs in the host app to point to production.

**Example URLs:**
- Host: `yourname-host.vercel.app`
- Chat: `yourname-chat.vercel.app`
- Email: `yourname-email.vercel.app`

## Features

### Chat Application
- Conversation list with search
- Message interface
- Unread badges
- Timestamps
- Mock real-time updates

### Email Application
- Inbox with filtering (All, Unread, Starred)
- Email search
- Compose new emails
- Read and reply
- Star/unstar functionality

### Host Application
- Design system showcase
- Component examples
- Architecture documentation
- Links to micro-frontends

## Technology Stack

- **React 18** - UI library
- **Vite 5** - Build tool (fast HMR, modern ESM)
- **Concurrently** - Run multiple dev servers
- **CSS Custom Properties** - Theming system

## Design Decisions

### Why Not Module Federation?

Initially considered Webpack Module Federation, but opted for simpler independent apps because:
- Easier to understand and debug
- No complex build configuration
- True independence (each app completely standalone)
- Works reliably across all environments

In production, you'd likely publish the design system as an npm package to avoid duplication.

### Why Port-Based Separation?

Using different ports for local development makes it easy to understand the boundaries. In production, these map to different domains or subdomains.

### Communication Strategy

Currently using browser navigation (window.open). Could be extended with:
- iframes + postMessage for embedded experiences
- localStorage/sessionStorage for shared state
- Dedicated event bus for cross-app communication

## Scaling This Architecture

### Adding New Micro-Frontends

1. Create new folder (e.g., `calendar/`)
2. Copy design system
3. Set up Vite config with unique port
4. Add link in host app

Takes about 10 minutes to scaffold a new micro-frontend.

### Production Improvements

For a production system, consider:

**1. Shared Design System as NPM Package**

Instead of copying the design system, publish it:

```bash
# Create packages/design-system
packages/design-system/
  ├── package.json  (name: "@company/design-system")
  ├── src/
  │   ├── Button.jsx
  │   ├── Card.jsx
  │   ├── Input.jsx
  │   └── Badge.jsx
  └── README.md

# In each app's package.json
{
  "dependencies": {
    "@company/design-system": "^1.0.0"
  }
}

# Import in any app
import { Button, Card } from '@company/design-system';
```

**Benefits:**
- Single source of truth
- Version control
- Easy updates across all apps
- Can be used in any project

**Other Production Improvements:**

- **Authentication** - Shared auth via JWT in cookies/localStorage
- **Error boundaries** - Graceful handling of micro-frontend failures
- **Monitoring** - Track performance and errors per micro-frontend
- **CI/CD** - Automated testing and deployment pipelines
- **TypeScript** - Type safety across boundaries
- **Testing** - Unit, integration, and E2E test suites

## Troubleshooting

**Port already in use?**
```bash
lsof -ti:5174 | xargs kill -9
lsof -ti:5175 | xargs kill -9
lsof -ti:5176 | xargs kill -9
```

**Design system not found?**
Make sure the designSystem folder was copied to chat and email apps.

**Apps not loading?**
Ensure all three dev servers are running. Check the terminal for errors.

## Performance Considerations

- Each app loads independently (code splitting by default)
- Design system adds ~50KB to each app
- Browser caches each app separately
- No runtime dependencies between apps

## Future Enhancements

Some ideas for extending this POC:

- Add React Router to each app for internal navigation
- Implement cross-app messaging with postMessage
- Add authentication flow
- Create shared state management
- Build notification system that works across apps
- Add real backend integration
- Implement lazy loading for micro-frontends

## Notes

This is a proof-of-concept focused on demonstrating the architecture. In a real-world scenario, you'd want to add:
- Proper error handling
- Loading states
- Authentication
- Backend integration
- Comprehensive testing
- Better state management
- Accessibility improvements

The goal here is to show how micro-frontends can work together while staying independent.

## Tech Choices Explained

**Why Vite?** - CRA is deprecated, Vite is the modern standard. Lightning-fast HMR and better DX.

**Why React?** - Team familiarity and ecosystem. Could use Vue, Svelte, or even mix frameworks.

**Why concurrently?** - Simple way to run all dev servers. Alternative would be Docker Compose.

**Why copy design system?** - Simplicity. Production would use npm packages.

## License

MIT - Feel free to use this as a starting point for your own micro-frontend projects.

---

Built with React + Vite
