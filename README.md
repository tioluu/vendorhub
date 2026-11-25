# VendorHub

A multi-vendor storefront platform. Each vendor creates their own store, which is served on its own subdomain (for example `alpha.yourdomain.com`). Customers shop and check out as guests, with no account and as little personal data as possible.

> **Status:** the vendor-side backend is complete. The public storefront, guest cart, checkout, frontend and deployment are in progress. See [Roadmap](#roadmap).

## Tech stack

- **Runtime:** Node.js, Express 5 (ES modules)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT for vendors, bcrypt for password hashing
- **Uploads:** Multer (local disk, JPEG/PNG/WebP, 5 MB limit)

## Running locally

Requirements: Node.js and a PostgreSQL database.

```bash
cd backend
npm install
```

Create `backend/.env` with these variables:

| Variable | Purpose |
| --- | --- |
| `POSTGRES_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign vendor tokens |
| `PORT` | Optional. Defaults to `3001` |
| `NODE_ENV` | Optional. `development` shows detailed error messages |

Then apply the database migrations, generate the Prisma client, and start the server:

```bash
npx prisma migrate dev
npx prisma generate
node --watch src/server.js
```

The API runs on `http://localhost:3001/api`.

## API overview

Routes marked 🔒 need an `Authorization: Bearer <token>` header from `/auth/login`. Routes marked 🏪 also need the vendor to have a store.

### Auth: `/api/auth`

| Method | Route | |
| --- | --- | --- |
| POST | `/register` | Create a vendor account |
| POST | `/login` | Get a token |
| GET | `/me` 🔒 | Current vendor |
| DELETE | `/me` 🔒 | Delete account |

### Stores: `/api/stores`

| Method | Route | |
| --- | --- | --- |
| GET | `/view-stores` | List stores |
| GET | `/view-store/:id` | One store |
| POST | `/create-store` 🔒 | Create the vendor's store (one per vendor; the name becomes the subdomain) |
| PATCH | `/customize-store` 🔒🏪 | Font and colours (validated) |
| POST | `/upload-banner` 🔒🏪 | Upload the store banner (form field `banner`) |
| PATCH | `/publish-store` 🔒🏪 | Make the store public |
| PATCH | `/unpublish-store` 🔒🏪 | Hide the store |
| DELETE | `/delete-store` 🔒🏪 | Delete the store (blocked if it has orders) |

### Products: `/api/products`

| Method | Route | |
| --- | --- | --- |
| POST | `/create-product` 🔒🏪 | Create a product |
| PATCH | `/edit-product/:id` 🔒🏪 | Edit any field(s) |
| POST | `/upload-image/:id` 🔒🏪 | Add an image (form field `image`) |
| DELETE | `/delete-image/:id/:imageId` 🔒🏪 | Remove an image |
| PATCH | `/publish-product/:id` 🔒🏪 | Publish (needs at least one image) |
| PATCH | `/unpublish-product/:id` 🔒🏪 | Unpublish |
| DELETE | `/delete-product/:id` 🔒🏪 | Archive the product |

### Categories: `/api/categories`

| Method | Route | |
| --- | --- | --- |
| POST | `/create-category` 🔒🏪 | Create a category |
| GET | `/view-categories` 🔒🏪 | List the store's categories |
| DELETE | `/delete-category/:id` 🔒🏪 | Delete a category |

## How it works

- **Ownership checks live in middleware.** `authenticateToken` identifies the vendor, `requireStore` loads their store, and `requireProduct` loads a product only if it belongs to that store. Controllers only do their own job, and a vendor can never reach another vendor's data.
- **Products are archived, not deleted.** Orders will reference products, so deleting one renames and archives it instead, and its name can be reused.
- **Uploads clean up after themselves.** If saving an image to the database fails, the file is removed. Replacing a banner or deleting an image removes the old file.

## Roadmap

- [x] Vendor accounts, stores, products, categories, images and store customization
- [ ] Public storefront on store subdomains
- [ ] Guest cart using opaque, hashed cart tokens in an httpOnly cookie
- [ ] Privacy-first checkout: pickup points with a pickup code, pay on delivery, phone number only (encrypted and deleted after the order)
- [ ] Vendor order management
- [ ] Frontend: vendor dashboard and storefront (Next.js)
- [ ] Deployment with wildcard subdomains

## Status dashboard

`status/` holds a small Angular dashboard that checks the API. See [status/README.md](status/README.md).
