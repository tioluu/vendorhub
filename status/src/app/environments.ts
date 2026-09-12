export type EnvId = 'dev' | 'prod';

export interface Environment {
  id: EnvId;
  name: string;
  /** Where the backend runs. The dev server proxies `${base}/api` there (see proxy.conf.json). */
  target: string;
  base: string;
  /** Read-only environments only get the automatic GET checks, never the full test. */
  readOnly: boolean;
  startCommand: string;
  resetCommand?: string;
}

/** The commands below are run from the repo root. */
const BACKEND = 'backend';

export const ENVIRONMENTS: Environment[] = [
  {
    id: 'dev',
    name: 'Dev',
    target: 'localhost:3001',
    base: '/dev',
    readOnly: false,
    startCommand: `cd ${BACKEND} && DOTENV_CONFIG_PATH=.dev.env node --watch src/server.js`,
    resetCommand: `cd ${BACKEND} && DOTENV_CONFIG_PATH=.dev.env npx prisma migrate reset`,
  },
  {
    id: 'prod',
    name: 'Prod',
    target: 'localhost:3000',
    base: '/prod',
    readOnly: true,
    startCommand: `cd ${BACKEND} && node --watch src/server.js`,
  },
];
