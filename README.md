# Micro-Frontend Architecture POC

A **professional, production-ready** demonstration of micro-frontend architecture using React + TypeScript + **Webpack Module Federation**, showcasing advanced patterns including runtime module loading, EventBus communication, and a complete design system documentation.

## 🚀 Professional Features

This project goes beyond basic micro-frontend concepts and demonstrates production-level features:

### ✨ Advanced Implementations

1. **🎨 Design System Documentation** - Storybook-like interactive component showcase
   - Live component previews with all variants
   - TypeScript prop tables
   - Copy-to-clipboard code snippets
   - Searchable and comprehensive

2. **🔔 EventBus Notification System** - Real-time cross-app communication
   - Pub/Sub pattern for decoupled communication
   - Live notification toasts for app events
   - Track micro-frontend opens/closes
   - Extensible for custom events

3. **🔌 Module Federation** - Runtime micro-frontend loading
   - Dynamic module loading at runtime using Webpack Module Federation
   - Shared dependencies (React, React-DOM, react-icons)
   - Zero build-time coupling between apps
   - True micro-frontend independence

4. **📘 Full TypeScript Implementation** - Enterprise-grade type safety
   - Fully typed React components with interfaces
   - Type declarations for shared modules
   - Compile-time error catching
   - Excellent IDE autocomplete

5. **⚙️ Environment-Based Configuration** - Smart deployment handling
   - Auto-switches between localhost (dev) and production URLs
   - `.env.development` and `.env.production` files
   - Zero configuration for team members

6. **🔄 Shared Design System** - True single source of truth
   - Design system exposed via Module Federation
   - Consumed by chat and email at runtime
   - TypeScript interfaces exported for type safety
   - Consistent UI across all micro-frontends

## What This Project Does

This is a **production-ready** micro-frontend architecture with three fully independent TypeScript applications:

- **Host Application** - Main dashboard, design system docs, notification system, federated module loader
- **Chat Application** - Messaging interface consuming shared design system via Module Federation
- **Email Application** - Email client consuming shared design system via Module Federation

Each application runs independently and can be developed, tested, and deployed separately.

## Quick Start

### ⚠️ Important: Module Federation requires Preview Mode

Due to limitations with `@originjs/vite-plugin-federation`, Module Federation **does not work in dev mode** (`npm run dev`). You must use **preview mode** which serves the built production assets.

```bash
# Install dependencies
npm run install:all

# Build all applications
npm run build

# Start preview servers (serves built assets)
npm run preview
```

Open http://localhost:5174 in your browser. You'll see the host application with buttons to open the chat and email apps.

**Why Preview Mode?**
- Dev mode (`npm run dev`) doesn't generate `remoteEntry.js` files properly
- Preview mode (`npm run preview`) serves the built production assets where Module Federation works correctly
- This is a known limitation of the Vite Module Federation plugin

## Environment Configuration

The host application uses environment variables to determine where to redirect to chat and email apps:

**Development** (`.env.development`):
- Chat: `http://localhost:5175`
- Email: `http://localhost:5176`

**Production** (`.env.production`):
- Chat: `https://chat-seven-psi-63.vercel.app`
- Email: `https://mail-sable.vercel.app`

Vite automatically loads the correct `.env` file based on the mode:
- `npm run dev` → uses `.env.development`
- `npm run build` → uses `.env.production`

This means in local development, clicking buttons will open `localhost` URLs, and in production, they'll open your deployed Vercel URLs.

**To customize URLs:**
1. Edit `host/.env.development` for local development URLs
2. Edit `host/.env.production` for production deployment URLs
3. Restart the dev server after changing environment files

## Architecture Overview

The project uses a simple but effective micro-frontend pattern:

```
Host App (5174)
├── Design System (defined here)
├── Shared Components
└── Links to micro-frontends
    ├── Chat App (5175) - consumes design system from host
    └── Email App (5176) - consumes design system from host
```

Each application:
- Runs on its own port
- Can be deployed independently
- Chat and Email consume the design system from Host (single source of truth)
- Maintains its own state and logic

## Why This Approach?

### Benefits

**Independence** - Each team can work on their app without blocking others. Deploy chat updates without touching email.

**Scalability** - Need a new feature? Create a new micro-frontend. The architecture scales horizontally.

**Technology Flexibility** - While all apps here use React, each could theoretically use different frameworks or versions.

**Resilience** - If one app has issues, others continue working. No single point of failure.

### Trade-offs

**Complexity** - More moving parts to manage compared to a monolith.

**Vite Alias Dependencies** - Chat and Email apps use Vite path aliases to consume the design system from Host. This works great in development but requires proper build configuration for production.

**Initial Setup** - Takes more time upfront to set up the architecture.

> **Note on Design System:** The design system is defined in the `host/src/designSystem/` directory. Chat and Email applications import it using Vite path aliases (`import { Button } from 'host'`). This ensures a single source of truth. In a more mature production environment, you might publish the design system as a scoped npm package (`@company/design-system`) for easier versioning and distribution across multiple teams.

## Project Structure

```
├── host/                    # Main application (Port 5174)
│   ├── .env.development     # Development URLs (localhost)
│   ├── .env.production      # Production URLs (Vercel)
│   ├── src/
│   │   ├── designSystem/   # Design System - Single source of truth
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Card/
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Card.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Input/
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Input.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Badge/
│   │   │   │   │   ├── Badge.tsx
│   │   │   │   │   ├── Badge.css
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   ├── eventBus.ts  # Pub/Sub event system
│   │   │   ├── styles.css
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── DesignSystemDocs.tsx  # Interactive documentation
│   │   │   ├── NotificationSystem.tsx # Real-time notifications
│   │   │   └── MicroFrontendModal.tsx # Iframe embedding
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
│
├── chat/                    # Chat micro-frontend (Port 5175)
│   ├── src/
│   │   ├── App.tsx         # Imports design system from 'host' + PostMessage
│   │   └── main.tsx
│   └── vite.config.ts       # Vite alias: 'host' → '../host/src/designSystem'
│
└── email/                   # Email micro-frontend (Port 5176)
    ├── src/
    │   ├── App.tsx         # Imports design system from 'host' + PostMessage
    │   └── main.tsx
    └── vite.config.ts       # Vite alias: 'host' → '../host/src/designSystem'
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

## Using Professional Features

### 1. Design System Documentation

Access the interactive design system documentation:
1. Open the host app (`http://localhost:5174`)
2. Click **"Design System Docs"** in the header navigation
3. Browse all components with live previews
4. Click the 📋 icon to copy code snippets
5. Review TypeScript prop tables for each component

### 2. Iframe Embedding Mode

Open micro-frontends within the host application:
1. Click **"Open in Modal (iframe)"** on any micro-frontend card
2. The app loads in a full-screen modal with iframe
3. Test postMessage communication with **"Send Test Message"** button
4. View communication logs at the bottom of the modal
5. Close with the ✕ button or click outside

### 3. EventBus Notifications

Watch real-time notifications for micro-frontend events:
1. Open or close micro-frontends (in modal or new tab)
2. Notifications appear in the top-right corner
3. The status bar shows active micro-frontends and open counts
4. Click **"Test EventBus"** to send a custom notification
5. All notifications auto-dismiss after 5 seconds

### 4. PostMessage Communication

The iframe modal demonstrates cross-origin communication:
- **Automatic**: Host sends connection message when iframe loads
- **Manual**: Click "Send Test Message" to send custom messages
- **Logging**: All messages are logged in the modal footer
- **Extensible**: Add custom message handlers in `MicroFrontendModal.tsx`

Example message format:
```typescript
window.postMessage({
  type: 'USER_ACTION',
  payload: { action: 'click', target: 'button' }
}, '*');
```

## Running the Applications

### Production Mode (Preview) - Required for Module Federation

**This is the recommended way to test Module Federation:**

```bash
# Build all apps
npm run build

# Start preview servers
npm run preview
```

This serves the built production assets on ports 5174, 5175, 5176 where Module Federation works correctly.

### Development Mode (Dev)

For rapid development without Module Federation:

```bash
npm run dev
```

**Note:** Module Federation will NOT work in dev mode. Use this only for:
- Developing individual app features
- Testing design system changes
- Working on UI components

When you need to test Module Federation, switch to preview mode.

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

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Module Federation implementation"

# Push to GitHub
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### Step 2: Deploy Each App to Vercel

You need to create **three separate Vercel projects** from the same repository:

#### Deploy HOST

1. Go to [vercel.com](https://vercel.com) and click "New Project"
2. Import your GitHub repository
3. Configure:
   - **Project Name**: `bluebash-host` (or your choice)
   - **Root Directory**: `host`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click "Deploy"
5. **Save the URL** (e.g., `https://bluebash-host.vercel.app`)

#### Deploy CHAT

1. Click "New Project" again (same repository)
2. Configure:
   - **Project Name**: `bluebash-chat`
   - **Root Directory**: `chat`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click "Deploy"
4. **Save the URL** (e.g., `https://bluebash-chat.vercel.app`)

#### Deploy EMAIL

1. Click "New Project" again (same repository)
2. Configure:
   - **Project Name**: `bluebash-email`
   - **Root Directory**: `email`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click "Deploy"
4. **Save the URL** (e.g., `https://bluebash-email.vercel.app`)

### Step 3: Update Module Federation URLs

After getting all three URLs, update the vite configs with production URLs:

#### host/vite.config.ts

```typescript
const isProduction = process.env.NODE_ENV === 'production';
const chatUrl = isProduction
  ? 'https://bluebash-chat.vercel.app'
  : 'http://localhost:5175';
const emailUrl = isProduction
  ? 'https://bluebash-email.vercel.app'
  : 'http://localhost:5176';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        chatApp: {
          external: `Promise.resolve('${chatUrl}/assets/remoteEntry.js')`,
          from: 'webpack',
          externalType: 'promise'
        },
        emailApp: {
          external: `Promise.resolve('${emailUrl}/assets/remoteEntry.js')`,
          from: 'webpack',
          externalType: 'promise'
        }
      },
      // ... rest of config
    })
  ],
  // ... rest of config
});
```

#### chat/vite.config.ts

```typescript
const isProduction = process.env.NODE_ENV === 'production';
const hostUrl = isProduction
  ? 'https://bluebash-host.vercel.app'
  : 'http://localhost:5174';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'chatApp',
      remotes: {
        host: {
          external: `Promise.resolve('${hostUrl}/assets/remoteEntry.js')`,
          from: 'webpack',
          externalType: 'promise'
        }
      },
      // ... rest of config
    })
  ],
  // ... rest of config
});
```

#### email/vite.config.ts

Same as CHAT, update with production HOST URL.

### Step 4: Update Environment Variables (Optional)

If using `.env` files, update HOST's environment variables in Vercel dashboard:

1. Go to HOST project settings
2. Navigate to "Environment Variables"
3. Add:
   ```
   VITE_CHAT_URL=https://bluebash-chat.vercel.app
   VITE_EMAIL_URL=https://bluebash-email.vercel.app
   ```

### Step 5: Redeploy

After updating configs:

```bash
git add .
git commit -m "Update Module Federation URLs for production"
git push
```

Vercel will automatically redeploy all projects.

### Step 6: Test Module Federation

1. Open `https://bluebash-host.vercel.app`
2. Click "Open (Module Federation)" for Chat
3. Open browser DevTools > Network tab
4. You should see `remoteEntry.js` loaded from the CHAT URL
5. The Chat app should load seamlessly

**Module Federation is now working across different Vercel deployments!** 🎉

## 📚 Documentation

- **[COMMUNICATION.md](./COMMUNICATION.md)** - Comprehensive guide to micro-frontend communication (EventBus + PostMessage)
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step Vercel deployment instructions

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

- **React 18** - UI library with hooks and functional components
- **TypeScript** - Full type safety with interfaces and type declarations
- **Vite 5** - Build tool (fast HMR, modern ESM)
- **Concurrently** - Run multiple dev servers
- **CSS Custom Properties** - Theming system
- **PostMessage API** - Cross-origin communication for iframe embedding (✅ Bi-directional)
- **EventBus Pattern** - Pub/sub messaging for decoupled app communication
- **Material Design Icons** - Professional icon library (react-icons/md)

## Design Decisions

### Why TypeScript?

TypeScript was chosen to provide:
- **Type Safety** - Catch errors at compile time, not runtime
- **Better DX** - Excellent IDE autocomplete and intellisense
- **Self-Documenting Code** - Interfaces serve as inline documentation
- **Scalability** - Easier to refactor and maintain as the codebase grows
- **Professional Standard** - Industry best practice for modern React applications

### Why Not Module Federation?

Initially considered Webpack Module Federation, but opted for simpler independent apps because:
- Easier to understand and debug
- No complex build configuration
- True independence (each app completely standalone)
- Works reliably across all environments

In production, you'd likely publish the design system as an npm package to avoid duplication.

### Why Port-Based Separation?

Using different ports for local development makes it easy to understand the boundaries. In production, these map to different domains or subdomains.

**Configured Ports:**
- **Host**: 5174 (main dashboard)
- **Chat**: 5175 (messaging app)
- **Email**: 5176 (email client)

All ports use `strictPort: true` to prevent auto-incrementing and catch conflicts early.

### Communication Strategy

This project implements multiple communication strategies:

**1. Browser Navigation (window.open)**
- Opens micro-frontends in new tabs
- Simplest approach for independent apps
- EventBus tracks when apps are opened/closed

**2. Iframe + PostMessage (✅ Fully Implemented)**
- Embeds micro-frontends within host application
- **Bi-directional** communication via postMessage API
- Message logging for debugging
- Lazy-loaded on demand
- **Works on Vercel** (cross-VM communication)
- **Actions tracked**: message_sent, email_sent, email_read, email_starred

**3. EventBus Pub/Sub (✅ Fully Implemented)**
- Decoupled event-driven communication
- Host app tracks micro-frontend lifecycle events
- Real-time notifications for user feedback
- Extensible for custom events
- **Integrates with PostMessage** - iframe events trigger EventBus notifications

Could be further extended with:
- localStorage/sessionStorage for shared state
- WebSockets for real-time bidirectional communication

## Scaling This Architecture

### Adding New Micro-Frontends

1. Create new folder (e.g., `calendar/`)
2. Copy design system
3. Set up Vite config with unique port
4. Add link in host app

Takes about 10 minutes to scaffold a new micro-frontend.

### Implemented Production Features

This POC already includes several production-ready features:

**✅ TypeScript** - Full type safety across all applications
**✅ Environment Configuration** - Automatic URL switching between dev and production
**✅ EventBus Communication** - Pub/sub pattern for decoupled messaging
**✅ Iframe Embedding** - Lazy-loaded micro-frontends with postMessage
**✅ Component Documentation** - Interactive Storybook-like showcase
**✅ Notification System** - Real-time user feedback
**✅ Professional UI** - Polished design with animations and transitions
**✅ Responsive Design** - Mobile-friendly layouts

### Additional Production Improvements

For a full production system, consider:

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
- **Monitoring** - Track performance and errors per micro-frontend (e.g., Sentry)
- **CI/CD** - Automated testing and deployment pipelines
- **Testing** - Unit, integration, and E2E test suites (Jest, React Testing Library, Playwright)
- **Code Splitting** - Further optimize bundle sizes with React.lazy
- **Service Workers** - Offline support and caching strategies

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

Some ideas for extending this POC further:

- ✅ ~~Implement cross-app messaging with postMessage~~ (Completed)
- ✅ ~~Build notification system that works across apps~~ (Completed via EventBus)
- ✅ ~~Implement lazy loading for micro-frontends~~ (Completed via iframe modal)
- Add React Router to each app for internal navigation
- Add authentication flow with JWT tokens
- Create shared state management (Redux, Zustand, or Jotai)
- Add real backend integration with REST/GraphQL APIs
- Implement WebSocket connections for real-time features
- Add unit and E2E testing with Jest and Playwright
- Implement error boundaries for graceful failure handling
- Add performance monitoring and analytics

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
