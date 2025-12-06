// Manual type definitions to replace missing vite/client types and fix build error

declare var process: {
  env: {
    NODE_ENV: string;
    [key: string]: string | undefined;
  };
};

interface ImportMetaEnv {
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
