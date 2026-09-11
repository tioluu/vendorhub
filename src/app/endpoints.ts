export type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/** A read-only request that's safe to send to any environment, prod included. */
export interface Probe {
  path: string;
  /** Status codes that mean the endpoint is working. */
  expect: number[];
  note?: string;
}

export interface Endpoint {
  id: string;
  method: Method;
  /** Route path; `:id` is filled in by the full test. */
  path: string;
  description: string;
  auth: boolean;
  /** Checked automatically on every environment. Endpoints without a probe are covered by the full test. */
  probe?: Probe;
}

export interface EndpointGroup {
  name: string;
  endpoints: Endpoint[];
}

export const HEALTH_ID = 'health';

// Mirrors ~/firstbackendproject/backend/src/server.js and its vendorRoutes. Cart is left out for now.
export const ENDPOINT_GROUPS: EndpointGroup[] = [
  {
    name: 'Health',
    endpoints: [
      {
        id: HEALTH_ID,
        method: 'GET',
        path: '/api',
        description: 'Health check',
        auth: false,
        probe: { path: '/api', expect: [200] },
      },
    ],
  },
  {
    name: 'Auth',
    endpoints: [
      {
        id: 'register',
        method: 'POST',
        path: '/api/auth/register',
        description: 'Create a vendor account',
        auth: false,
      },
      {
        id: 'login',
        method: 'POST',
        path: '/api/auth/login',
        description: 'Log in and get a token',
        auth: false,
      },
      {
        id: 'me',
        method: 'GET',
        path: '/api/auth/me',
        description: 'Profile of the logged-in vendor',
        auth: true,
      },
      {
        id: 'delete-account',
        method: 'DELETE',
        path: '/api/auth/me',
        description: 'Delete your own vendor account',
        auth: true,
      },
    ],
  },
  {
    name: 'Users',
    endpoints: [
      {
        id: 'forgot-password',
        method: 'POST',
        path: '/api/users/forgot-password',
        description: 'Request a password reset (placeholder)',
        auth: false,
      },
    ],
  },
  {
    name: 'Stores',
    endpoints: [
      {
        id: 'view-stores',
        method: 'GET',
        path: '/api/stores/view-stores',
        description: 'List all stores',
        auth: false,
        probe: { path: '/api/stores/view-stores', expect: [200] },
      },
      {
        id: 'view-store',
        method: 'GET',
        path: '/api/stores/view-store/:id',
        description: 'Get one store by id',
        auth: false,
        probe: {
          path: '/api/stores/view-store/1',
          expect: [200, 404],
          note: 'Checked with id 1. A 404 just means no store has that id.',
        },
      },
      {
        id: 'create-store',
        method: 'POST',
        path: '/api/stores/create-store',
        description: 'Create your store',
        auth: true,
      },
      {
        id: 'customize-store',
        method: 'PATCH',
        path: '/api/stores/customize-store',
        description: 'Change font and colours',
        auth: true,
      },
      {
        id: 'delete-store',
        method: 'DELETE',
        path: '/api/stores/delete-store',
        description: 'Delete your store',
        auth: true,
      },
    ],
  },
  {
    name: 'Products',
    endpoints: [
      {
        id: 'view-product',
        method: 'GET',
        path: '/api/products/view-product',
        description: "List a store's products",
        auth: false,
        probe: { path: '/api/products/view-product', expect: [200] },
      },
      {
        id: 'create-product',
        method: 'POST',
        path: '/api/products/create-product',
        description: 'Add a product to your store',
        auth: true,
      },
      {
        id: 'edit-product',
        method: 'PATCH',
        path: '/api/products/edit-product/:id',
        description: 'Edit a product',
        auth: true,
      },
      {
        id: 'delete-product',
        method: 'DELETE',
        path: '/api/products/delete-product/:id',
        description: 'Delete a product',
        auth: true,
      },
    ],
  },
  {
    name: 'Categories',
    endpoints: [
      {
        id: 'view-categories',
        method: 'GET',
        path: '/api/categories/view-categories',
        description: 'List all categories',
        auth: false,
        probe: { path: '/api/categories/view-categories', expect: [200] },
      },
      {
        id: 'create-category',
        method: 'POST',
        path: '/api/categories/create-category',
        description: 'Create a category',
        auth: false,
      },
      {
        id: 'delete-category',
        method: 'DELETE',
        path: '/api/categories/delete-category/:id',
        description: 'Delete a category',
        auth: false,
      },
    ],
  },
];

export const ALL_ENDPOINTS = ENDPOINT_GROUPS.flatMap((group) => group.endpoints);
