# Micro-Frontend Communication Architecture

## Overview

This project uses **two communication methods** to enable micro-frontends to work together:

1. **EventBus** - For internal communication within the HOST application
2. **PostMessage API** - For cross-origin communication between HOST and embedded micro-frontends

---

## 🏠 Local Development Communication

### Architecture
```
┌─────────────────────────────────────────┐
│  localhost (Single Machine)             │
│                                         │
│  HOST (5174) ←─EventBus→ Notifications │
│       ↓                                 │
│    iframe                               │
│       ↓                                 │
│  ┌─────────────────┐                   │
│  │ CHAT (5175)     │←─PostMessage─→    │
│  └─────────────────┘                   │
│  ┌─────────────────┐                   │
│  │ EMAIL (5176)    │←─PostMessage─→    │
│  └─────────────────┘                   │
└─────────────────────────────────────────┘
```

---

## ☁️ Production (Vercel) Communication

### Architecture
```
┌──────────────────────────────────────┐
│  VM 1: host-app.vercel.app          │
│  ┌────────────────────────────────┐ │
│  │ HOST Application               │ │
│  │ - EventBus (internal only)     │ │
│  │ - Notification System          │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
              │
              │ PostMessage API
              │ (Browser Native)
              ↓
    ┌─────────────────────┐
    │ iframe communication │
    └─────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
    ↓                    ↓
┌────────────────┐  ┌────────────────┐
│ VM 2           │  │ VM 3           │
│ chat-app       │  │ email-app      │
│ .vercel.app    │  │ .vercel.app    │
│                │  │                │
│ CHAT App       │  │ EMAIL App      │
│ - PostMessage  │  │ - PostMessage  │
└────────────────┘  └────────────────┘
```

---

## 📡 Communication Methods

### 1. EventBus (HOST Internal Only)

**Location**: `host/src/designSystem/eventBus.ts`

**Pattern**: Pub/Sub

**Scope**: ✅ Works within HOST only

**Usage**:
```typescript
// Emit event
eventBus.emit('chat:opened', { timestamp: Date.now() });

// Listen for event
eventBus.on('chat:opened', (data) => {
  console.log('Chat opened!', data);
});
```

**Events**:
- `chat:opened` - When chat modal opens
- `chat:closed` - When chat modal closes
- `email:opened` - When email modal opens
- `email:closed` - When email modal closes
- `notification` - Custom notifications

---

### 2. PostMessage API (Cross-Origin Communication)

**Scope**: ✅ Works locally AND on Vercel

**Direction**: Bi-directional (HOST ↔ Micro-frontends)

#### HOST → Micro-Frontend

```typescript
// HOST sends message to iframe
iframeRef.current.contentWindow.postMessage(
  {
    type: 'HOST_CONNECTED',
    payload: { hostApp: 'Bluebash Host', timestamp: '...' }
  },
  '*' // In production: use specific origin
);
```

**Message Types**:
| Type | Sent By | Purpose |
|------|---------|---------|
| `HOST_CONNECTED` | HOST | Notify micro-frontend that host is ready |
| `TEST_MESSAGE` | HOST | Testing communication |

#### Micro-Frontend → HOST

```typescript
// CHAT/EMAIL sends message to parent
window.parent.postMessage(
  {
    type: 'APP_LOADED',
    payload: { app: 'chat', timestamp: '...' }
  },
  '*' // In production: use specific origin
);
```

**Message Types**:
| Type | Sent By | Purpose |
|------|---------|---------|
| `APP_LOADED` | CHAT/EMAIL | Acknowledge successful load |
| `USER_ACTION` | CHAT/EMAIL | Notify HOST of user actions |

---

## 🔄 Communication Flow Examples

### Example 1: User Opens Chat Modal

```
1. User clicks "Open Chat" button
   ↓
2. HOST:
   - eventBus.emit('chat:opened') ✅
   - Opens modal with <iframe src="http://localhost:5175">
   - NotificationSystem shows "Chat opened" ✅
   ↓
3. CHAT iframe loads:
   - Detects it's in iframe (window.self !== window.top)
   - Listens for postMessage events ✅
   ↓
4. HOST sends postMessage:
   - { type: 'HOST_CONNECTED', payload: {...} } ✅
   ↓
5. CHAT receives message:
   - Logs: "[CHAT] Connected to HOST"
   - Sends acknowledgment: { type: 'APP_LOADED' } ✅
   ↓
6. HOST receives APP_LOADED:
   - Logs: "[HOST] chat app loaded successfully"
   - eventBus.emit('notification', { message: 'CHAT application loaded', type: 'success' }) ✅
   - NotificationSystem shows success notification ✅
```

### Example 2: User Sends Chat Message

```
1. User types message in CHAT and clicks Send
   ↓
2. CHAT:
   - Updates local state ✅
   - Calls notifyHostOfAction('message_sent', { message: '...' }) ✅
   ↓
3. CHAT sends postMessage:
   - window.parent.postMessage({
       type: 'USER_ACTION',
       payload: { app: 'chat', action: 'message_sent', data: {...} }
     }) ✅
   ↓
4. HOST receives message:
   - Logs action in console ✅
   - Updates message log in modal ✅
   - eventBus.emit('notification', { message: 'Message sent in chat: "..."', type: 'info' }) ✅
   ↓
5. NotificationSystem shows notification:
   - "Message sent in chat: [message text]" ✅
```

### Example 3: User Sends Email

```
1. User composes and sends email
   ↓
2. EMAIL:
   - Sends email (shows alert) ✅
   - Calls notifyHostOfAction('email_sent', { to: '...', subject: '...' }) ✅
   ↓
3. EMAIL sends postMessage:
   - window.parent.postMessage({
       type: 'USER_ACTION',
       payload: { app: 'email', action: 'email_sent', data: {...} }
     }) ✅
   ↓
4. HOST receives message:
   - eventBus.emit('notification', { message: 'Email sent to ...', type: 'info' }) ✅
   ↓
5. NotificationSystem shows notification:
   - "Email sent to [recipient]: [subject]" ✅
```

---

## 🎯 Actions Tracked

### CHAT Actions
| Action | Trigger | Data |
|--------|---------|------|
| `message_sent` | User sends chat message | `{ conversationId, message }` |

### EMAIL Actions
| Action | Trigger | Data |
|--------|---------|------|
| `email_read` | User opens email | `{ emailId, subject }` |
| `email_starred` | User stars/unstars email | `{ emailId, starred, subject }` |
| `email_sent` | User sends email | `{ to, subject }` |

---

## 🔒 Security Notes

### Current Setup (Development)
```typescript
// Accepts messages from any origin
window.postMessage({...}, '*');
```

### Production Setup (Recommended)
```typescript
// Verify origin before processing
if (event.origin !== 'https://host-app.vercel.app') return;

// Send to specific origin
window.parent.postMessage({...}, 'https://host-app.vercel.app');
```

**TODO for Production**:
1. Replace `'*'` with actual Vercel URLs
2. Add origin verification in all message listeners
3. Validate message structure and content

---

## 📊 Communication Matrix

| Feature | Local | Vercel | Technology |
|---------|-------|--------|------------|
| **HOST EventBus** | ✅ | ✅ | Custom Pub/Sub |
| **PostMessage (HOST → CHAT)** | ✅ | ✅ | Browser API |
| **PostMessage (CHAT → HOST)** | ✅ | ✅ | Browser API |
| **PostMessage (HOST → EMAIL)** | ✅ | ✅ | Browser API |
| **PostMessage (EMAIL → HOST)** | ✅ | ✅ | Browser API |
| **Direct CHAT ↔ EMAIL** | ❌ | ❌ | Not implemented |
| **Shared EventBus across apps** | ❌ | ❌ | Not possible (different VMs) |

---

## 🚀 Testing Communication

### 1. Open Browser Console
```bash
npm run dev
```

### 2. Open HOST Application
Navigate to `http://localhost:5174`

### 3. Open Chat Modal
Click "Open in Modal (iframe)" for Chat

### 4. Watch Console Logs
```
[CHAT] Received message from HOST: {type: "HOST_CONNECTED", ...}
[CHAT] Connected to HOST
[HOST] chat app loaded successfully
```

### 5. Send a Chat Message
Type and send a message in the chat interface

### 6. Watch Notifications
- Console: `[HOST] User performed action in chat`
- UI: Notification toast appears with message details

---

## 🎓 Key Takeaways

1. **EventBus** only works within the HOST application (same VM)
2. **PostMessage** is the ONLY way to communicate between different micro-frontends on Vercel
3. All micro-frontends detect if they're embedded: `window.self !== window.top`
4. All user actions in embedded apps send notifications to HOST
5. HOST aggregates all events and shows them in the NotificationSystem
6. Communication is bi-directional and works on both local and production

---

## 📝 Files Modified

1. **chat/src/App.tsx** - Added PostMessage listeners and senders
2. **email/src/App.tsx** - Added PostMessage listeners and senders
3. **host/src/components/MicroFrontendModal.tsx** - Enhanced message handling + EventBus integration

---

Built with ❤️ for demonstrating micro-frontend communication patterns!
