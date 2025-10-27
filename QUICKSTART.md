# Quick Start Guide

## 🚀 Get Started in 2 Steps

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Run the Application

```bash
npm run dev
```

That's it! Open **http://localhost:5174** in your browser.

---

## What You'll See

The terminal will show color-coded logs:
- 🔵 **HOST** (Blue) - Main application on port 5174
- 🟢 **CHAT** (Green) - Chat micro-frontend on port 5175
- 🟣 **EMAIL** (Magenta) - Email micro-frontend on port 5176

Wait for all three services to show "Local: http://localhost:517X" before opening the browser.

**From the host app (5174), click the buttons to open:**
- Chat application → Opens http://localhost:5175
- Email application → Opens http://localhost:5176

Each app runs independently!

---

## Build for Production

```bash
npm run build
```

Builds all three applications.

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services in one terminal |
| `npm run dev:host` | Start only host app |
| `npm run dev:chat` | Start only chat app |
| `npm run dev:email` | Start only email app |
| `npm run build` | Build all for production |
| `npm run preview` | Preview production builds |
| `npm run install:all` | Install all dependencies |

---

## Troubleshooting

### Port already in use?
```bash
# macOS/Linux
lsof -ti:5174 | xargs kill -9
lsof -ti:5175 | xargs kill -9
lsof -ti:5176 | xargs kill -9

# Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

### Module not found?
Make sure all 3 services are running. Check the terminal for errors.

### Need to stop?
Press `Ctrl+C` once in the terminal to stop all services.

---

## Next Steps

✅ Read the full [README.md](./README.md) for architecture details
✅ Explore the Chat app (click the Chat tab)
✅ Explore the Email app (click the Email tab)
✅ Check out the Design System in `host/src/designSystem/`
✅ Review the Module Federation configs in `*/vite.config.js`

---

**Built with React + Vite + Module Federation**
