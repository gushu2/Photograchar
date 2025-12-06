// Removed reference to 'vite/client' to fix missing type definition error
// Used 'declare var' for process to avoid "Cannot redeclare block-scoped variable" error if already defined in environment
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  };
};
