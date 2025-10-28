/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAT_URL: string;
  readonly VITE_EMAIL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Module Federation type declarations
declare module 'chatApp/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'emailApp/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'host/designSystem' {
  export * from './designSystem';
}
