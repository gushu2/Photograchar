// Augment the NodeJS namespace to include the API_KEY property on ProcessEnv.
// This avoids redeclaring the global 'process' variable which causes TypeScript errors.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}
