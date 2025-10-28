# Local Setup Guide - Module Federation

## 🎯 Quick Summary

Module Federation **requires preview mode** in local development due to Vite plugin limitations.

---

## 📋 Complete Setup Steps

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Build All Apps

```bash
npm run build
```

This generates the required `remoteEntry.js` files for Module Federation.

### 3. Start Preview Servers

```bash
npm run preview
```

All apps run on their configured ports (5174, 5175, 5176).

### 4. Open Browser

Navigate to: **http://localhost:5174**

### 5. Test Module Federation

Click "Open (Module Federation)" and watch:
- Network tab shows `remoteEntry.js` loading
- CHAT/EMAIL loads dynamically
- Shared React dependencies
- Design system consumed remotely

---

## 🔄 Development Workflow

### Making Changes

```bash
# 1. Edit files in your editor
vim host/src/App.tsx

# 2. Rebuild the modified app
cd host && npm run build

# 3. Preview automatically serves new build
# Just refresh your browser!
```

### Rebuilding All Apps

```bash
# From root directory
npm run build

# Apps rebuild in parallel (~2-3 seconds total)
```

---

## ⚠️ Important: Dev Mode Limitation

### Why Preview Mode?

`npm run dev` **does not work** with Module Federation because:

1. **remoteEntry.js not generated**: Vite dev server doesn't create the Module Federation manifest
2. **Plugin limitation**: `@originjs/vite-plugin-federation` v1.4.1 only supports build mode properly
3. **Industry standard**: Real Module Federation (Webpack) also requires build step

### When to Use Dev Mode

Use `npm run dev` for:
- ✅ Developing UI components
- ✅ Testing individual features
- ✅ Design system changes
- ✅ Fast hot reload iteration

**But NOT for:**
- ❌ Testing Module Federation
- ❌ Demonstrating remote modules
- ❌ Verifying shared dependencies

---

## 🎓 What You'll See Working

### In Browser Network Tab

```
remoteEntry.js          (from localhost:5175)  ← Module manifest
__federation_fn_import  ← Federation runtime
__federation_expose_App ← Exposed CHAT component
__federation_shared_react ← Shared React (loaded once!)
```

### In Console

```
[HOST] Loading remote module: chatApp/App
[CHAT] Design system imported from host
✓ Module Federation working!
```

### Visual Confirmation

- ✅ CHAT opens in modal
- ✅ Uses HOST's design system
- ✅ Notifications show open/close
- ✅ Window close tracking works

---

## 📊 Performance Benefits

### Without Module Federation (Separate Builds)

```
HOST:  200 KB (React + design system)
CHAT:  250 KB (React + design system + chat)
EMAIL: 250 KB (React + design system + email)
Total: 700 KB
```

### With Module Federation

```
HOST:  200 KB (React + design system)
CHAT:   50 KB (only chat logic, shares React)
EMAIL:  50 KB (only email logic, shares React)
Total: 300 KB (57% reduction!)
```

---

## 🚀 Vercel Deployment

After local testing works, deploy to Vercel:

### Quick Deploy

```bash
# 1. Push to GitHub
git add .
git commit -m "Module Federation ready"
git push

# 2. Create 3 Vercel projects:
# - bluebash-host (root: host/)
# - bluebash-chat (root: chat/)
# - bluebash-email (root: email/)

# 3. Each auto-deploys on push!
```

### Update Production URLs

After deployment, update `vite.config.ts` with production URLs:

```typescript
const chatUrl = process.env.NODE_ENV === 'production'
  ? 'https://bluebash-chat.vercel.app'
  : 'http://localhost:5175';
```

See **README.md** for complete Vercel instructions.

---

## 🔍 Troubleshooting

### "Failed to fetch remoteEntry.js"

**Cause**: Preview servers not running

**Solution**:
```bash
npm run preview
```

### "Port already in use"

**Solution**:
```bash
pkill -f vite
npm run preview
```

### "Module not found: chatApp/App"

**Cause**: CHAT app not built

**Solution**:
```bash
npm run build
npm run preview
```

### Changes not reflecting

**Solution**:
```bash
# Rebuild the modified app
cd host && npm run build

# Hard refresh browser (Cmd+Shift+R)
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `npm run build` completes without errors
- [ ] `npm run preview` starts all 3 servers
- [ ] http://localhost:5174 shows HOST dashboard
- [ ] Click "Open (Module Federation)" works for CHAT
- [ ] Browser Network tab shows `remoteEntry.js` loading
- [ ] CHAT modal opens with shared design system
- [ ] Close notifications appear
- [ ] Same works for EMAIL app

---

## 📚 Next Steps

1. ✅ Local setup working → Read **README.md** for full docs
2. ✅ Ready to deploy → Follow **README.md** Vercel section
3. ✅ Understanding architecture → Read **MODULE_FEDERATION.md**
4. ✅ Quick reference → Use **QUICKSTART.md**

---

## 💡 Pro Tips

### Faster Rebuilds

Rebuild only the app you changed:

```bash
# Only rebuild HOST
cd host && npm run build

# Only rebuild CHAT
cd chat && npm run build
```

### Keep Preview Running

Leave `npm run preview` running in a terminal. Just rebuild the app you're working on, then refresh browser.

### Interview Demo

For interviews, have this ready:

```bash
# Terminal 1: Preview servers
npm run preview

# Terminal 2: Your editor
code .

# Browser: http://localhost:5174
# DevTools: Network tab open
```

Click "Open (Module Federation)" → Show the Network tab → Explain the architecture!

---

**Your Module Federation setup is ready for local development and interviews!** 🎉
