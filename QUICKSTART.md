# Quick Start Guide - Module Federation

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm run install:all
```

This installs dependencies for all three apps (host, chat, email).

---

### Step 2: Build All Applications

```bash
npm run build
```

**Why build first?** Module Federation doesn't work in Vite dev mode. We need to build the apps to generate `remoteEntry.js` files.

You should see:
```
✓ built in 757ms
✓ built in 689ms
✓ built in 680ms
```

---

### Step 3: Start Preview Servers

```bash
npm run preview
```

**Important**: Use preview mode (not dev mode) for Module Federation to work.

You should see:
```
[HOST]  ➜  Local:   http://localhost:5174/
[CHAT]  ➜  Local:   http://localhost:5175/
[EMAIL] ➜  Local:   http://localhost:5176/
```

---

### Step 4: Open in Browser

Navigate to: **http://localhost:5174**

You'll see the HOST application dashboard.

---

### Step 5: Test Module Federation

1. Click **"Open (Module Federation)"** on the Chat card
2. Watch the browser Network tab - you'll see:
   - `remoteEntry.js` loaded from localhost:5175
   - CHAT app loads dynamically
3. The CHAT app appears in a modal using shared React + design system
4. Click "Send" to send a message
5. Close and try EMAIL app

---

## 🎯 What's Happening?

When you click "Open (Module Federation)":

1. **HOST** requests `http://localhost:5175/assets/remoteEntry.js`
2. **Module Federation Runtime** checks:
   - Does React exist? ✅ Yes, use HOST's version
   - Does design system exist? ✅ Yes, use HOST's version
   - Need CHAT-specific code? ⬇️ Download only that
3. **CHAT** loads using shared dependencies
4. Total bundle size: **~50 KB** instead of ~250 KB!

---

## 📁 Project Structure

```
├── host/                          # Main application (5174)
│   ├── src/
│   │   ├── designSystem/         # Exposed via Module Federation
│   │   └── components/
│   │       └── FederatedWrapper.tsx  # Loads remote apps
│   └── vite.config.ts            # Exposes designSystem, imports chatApp/emailApp
│
├── chat/                          # Chat micro-frontend (5175)
│   ├── src/
│   │   └── App.tsx               # Exposed as './App'
│   └── vite.config.ts            # Exposes App, imports host/designSystem
│
└── email/                         # Email micro-frontend (5176)
    ├── src/
    │   └── App.tsx               # Exposed as './App'
    └── vite.config.ts            # Exposes App, imports host/designSystem
```

---

## ⚠️ Dev Mode vs Preview Mode

### Why Not `npm run dev`?

Module Federation **does not work** with `npm run dev` because:

1. **Missing remoteEntry.js**: Vite dev mode doesn't generate the `remoteEntry.js` files that Module Federation needs
2. **Plugin Limitation**: This is a known limitation of `@originjs/vite-plugin-federation` v1.4.1
3. **No Hot Reload**: Preview mode doesn't have hot reload - you need to rebuild after changes

### When to Use Each Mode

**Use `npm run dev` for:**
- Developing individual app features
- Testing design system changes
- Working on UI components
- Fast iteration with hot reload

**Use `npm run build` + `npm run preview` for:**
- Testing Module Federation
- Verifying production builds
- Demonstrating the architecture
- Interview preparation

### Development Workflow

```bash
# Make changes to code
vim host/src/App.tsx

# Rebuild the specific app
cd host && npm run build

# Preview servers auto-reload the new build
# Refresh browser to see changes
```

---

## 🔧 Troubleshooting

### Problem: "Module Federation not working in dev mode"

**Solution**: This is expected! Use `npm run build` + `npm run preview` instead.

### Problem: Apps won't start

**Error**: `Port 5174 is already in use`

**Solution**:
```bash
# Kill processes on ports
lsof -ti:5174 | xargs kill -9
lsof -ti:5175 | xargs kill -9
lsof -ti:5176 | xargs kill -9

# Restart
npm run dev
```

### Problem: "Cannot find module 'chatApp/App'"

**Solution**: Ensure CHAT app is running on port 5175
```bash
# Check if running
curl http://localhost:5175/assets/remoteEntry.js

# Should return JavaScript, not 404
```

### Problem: Build fails with TypeScript errors

**Solution**: The most common error is implicit `any` types:
```typescript
// ❌ Wrong
onChange={(e) => setValue(e.target.value)}

// ✅ Correct
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
```

### Problem: Module Federation not working

**Checklist**:
- [ ] All three apps running?
- [ ] Check Network tab for remoteEntry.js requests
- [ ] Check browser console for errors
- [ ] Verify vite.config.ts has correct URLs

---

## 🏗️ Building for Production

```bash
# Build all apps
npm run build

# Each app outputs to its own dist/ folder:
# - host/dist/
# - chat/dist/
# - email/dist/
```

---

## 📚 Documentation

- **[MODULE_FEDERATION.md](./MODULE_FEDERATION.md)** - Comprehensive guide with architecture details
- **[README.md](./README.md)** - Full project documentation
- **[SUMMARY.md](./SUMMARY.md)** - Quick overview of features

---

## 🎓 Key Concepts to Understand

### 1. **remoteEntry.js**
Every federated app generates this file. It's the "manifest" that tells other apps:
- What modules are exposed
- What dependencies are needed
- Where to fetch chunks

### 2. **Shared Dependencies**
```typescript
shared: ['react', 'react-dom', 'react-icons']
```
This ensures React is loaded **once** and shared across all apps.

### 3. **Exposes**
Makes modules available to other apps:
```typescript
exposes: {
  './designSystem': './src/designSystem/index.ts',  // HOST
  './App': './src/App.tsx',                          // CHAT/EMAIL
}
```

### 4. **Remotes**
Tells an app where to fetch remote modules:
```typescript
remotes: {
  chatApp: 'http://localhost:5175/assets/remoteEntry.js',  // HOST
  host: 'http://localhost:5174/assets/remoteEntry.js',     // CHAT/EMAIL
}
```

---

## ✅ Success Checklist

After following this guide, you should be able to:

- [x] Start all three apps simultaneously
- [x] Open HOST at http://localhost:5174
- [x] Click "Open (Module Federation)" and see CHAT load
- [x] See remoteEntry.js requests in Network tab
- [x] Send a message in CHAT
- [x] Close CHAT and open EMAIL
- [x] Build all apps successfully with `npm run build`

---

## 🎯 What Your Interviewer Will See

1. **Runtime Module Loading**: Apps load dynamically, not at build time
2. **Shared Dependencies**: Only one copy of React across all apps
3. **True Independence**: Each app can be deployed separately
4. **TypeScript**: Full type safety with Module Federation
5. **Production Ready**: Complete with error handling, loading states

---

## 🚀 Next Steps

1. Explore the code in `host/src/components/FederatedWrapper.tsx`
2. Check Module Federation config in `vite.config.ts` files
3. Read the full [MODULE_FEDERATION.md](./MODULE_FEDERATION.md) guide
4. Try modifying CHAT or EMAIL and see hot reload in action

---

**Ready for your interview!** 🎉

This implementation demonstrates a **production-grade** understanding of:
- Webpack Module Federation
- Micro-frontend architecture
- Runtime module loading
- Dependency sharing
- TypeScript integration

Good luck! 🚀
