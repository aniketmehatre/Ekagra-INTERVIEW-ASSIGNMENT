# Platform Commons Product Management & E-Commerce Module

This is a production-ready, feature-rich Angular 20 application demonstrating modern best practices in frontend architecture, state management, and user experience. The application features secure, role-based user flows consisting of a customer-facing product shop/catalog, shopping cart, and a multi-step checkout workflow, as well as an administrative dashboard with real-time stock simulations and product management (CRUD).

---

## 🚀 Key Architectural Features & Modern Practices

* **Angular 20 Standalone Pattern**: No `NgModule` wrappers. Every component, pipe, directive, and routing guard is fully standalone, minimizing overhead and ensuring clean module segregation.
* **Angular Signals State Management**: Leverages Angular Signals (`signal`, `computed`) for reactive, granular, and efficient state tracking. No zone-wide manual trigger updates required. Used for the central `ProductStore`, `CartService`, and `CheckoutStateService`.
* **OnPush Change Detection Strategy**: Enforced globally on all key components (`changeDetection: ChangeDetectionStrategy.OnPush`) to optimize performance and prevent unnecessary change detection cycles.
* **Modern Dependency Injection**: Consistent use of the modern `inject()` function to request services, configurations, and utilities.
* **RxJS Integration & Stream Handling**: Utilizes debouncing for search features, interval-based stock simulation streams, and clean sub-unsubscriptions utilizing `takeUntilDestroyed()`.
* **Robust Route Guarding**: Custom functional route guards (`authGuard`, `adminGuard`, `checkoutGuard`) secure routes using role-based redirection policies and query return links.
* **Visual Polish & Premium Aesthetics**: Responsive, interactive, modern layouts styled with Bootstrap 5.3.8, including smooth hover states, dynamic loading indicators via a reusable Shimmer Skeleton Loader, and real-time validation warning feedbacks.

---

## 📂 Project Directory Structure

```text
src/app/
├── core/
│   ├── models/
│   │   └── product.model.ts          # Strongly-typed interfaces for products
│   └── mock/
│       └── user.ts                   # Mock user database for authentication
├── services/
│   ├── auth.ts                       # Handles login, session management & roles
│   ├── token.ts                      # Token services
│   ├── product.service.ts            # DummyJSON API integration wrapper
│   ├── product.store.ts              # Signal-based store for product states & stock simulator
│   ├── cart.service.ts               # Signal-based cart management & price calculations
│   ├── checkout-state.service.ts     # Tracks completion steps for checkout flow
│   └── order.service.ts              # Simulated order submission API
├── guards/
│   ├── auth-guard.ts                 # Enforces authentication & records returnUrl
│   └── admin-guard.ts                # Enforces administrative privileges
├── features/
│   ├── auth/
│   │   └── login/                    # Credentials validation & session initialization
│   ├── shop/
│   │   ├── shop-shell/               # Main wrapper for e-commerce store with navbar
│   │   ├── catalog/                  # Multi-faceted search, filter, and browse catalog
│   │   ├── product-card/             # Card layout with rating stars and "Add to Cart"
│   │   ├── product-detail/           # Expanded details view
│   │   ├── cart/                     # Cart listing, quantity adjustments & item deletion
│   │   └── checkout/                 # Multi-step shipping, payment & placement
│   └── admin/
│       ├── admin-layout/             # Admin header, sidebar and layout structure
│       ├── dashboard/                # Entry dashboard panel for admins
│       ├── product-management/       # Products dashboard list table with pagination/search
│       └── product-form/             # Reusable add/edit dialog/modal form with live preview
├── shared/
│   └── components/
│       ├── navbar/                   # Navigation bar showing current user state & cart items
│       ├── skeleton-loader/          # Shimmer effect layout placeholders for cards/rows/text
│       └── dynamic-form/             # Meta-configured schema-based form renderer
```

---

## 🛠️ Feature Breakdown

### 1. Authentication & Session Security
* **Route Guards**:
  - `authGuard` intercepts unauthorized access and appends `?returnUrl=...` to navigate the user back after signing in.
  - `adminGuard` permits navigation only if the user role is `admin`.
* **Session Persistence**: Saves credentials payload securely inside `sessionStorage` in encoded form (mock JWT) and restores active sessions automatically on page refresh.

### 2. Customer Shop & Catalog
* **Dynamic Search & Filters**: Search catalog items by text (debounced dynamically) and filter concurrently by multiple categories, price ranges (min/max range slider support), and availability status (in-stock only).
* **Syncing via Query Params**: Syncs active searches and filters directly to the URL query string. This enables bookmarking specific catalog configurations and preserves filter states when navigating back from details pages.
* **Interactive Shopping Cart**: Tracks items, adjusts counts, calculates subtotals, and exposes checkout conditions via computed signals.

### 3. Multi-Step Checkout Workflow
* **Guarded Steps**: Multi-step flow (`/shop/checkout/step/:n`) protected by `checkoutGuard` that guarantees users cannot jump steps without satisfying predecessor inputs.
* **Regex Validations**: Reactive forms enforce rigid format validation rules (e.g., email syntax, postal codes matching patterns, credit card details like expiry date `MM/YY` and CVVs).
* **Dynamic Form Control**: Shared schema-based form rendering capabilities for future dynamic layout additions.

### 4. Admin Management Dashboard
* **Dynamic Table Listing**: View all products in a highly optimized grid layout with status badges:
  - `✅ In Stock`: Stock quantity > 5 (Green)
  - `⚠️ Low Stock`: Stock quantity 1 to 5 (Yellow)
  - `❌ Out of Stock`: Stock quantity = 0 (Red)
* **Real-time Live Stock Simulation**: Operates a background interval that simulates fluctuations in inventory stock levels for current display items, keeping the dashboard feeling dynamic and alive.
* **Optimistic Deletes**: Instantly removes a product from the view on delete. If the API returns an error, the operation is rolled back and the original state is restored.
* **Modal Forms & Image Preview**: Dynamic dialog handles both addition and updates. Previews target thumbnail imagery in real-time as users type.

---

## 🔑 Mock Credentials for Testing

You can log in to the application using any of the following accounts:

| Email | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| **`admin@test.com`** | `admin123` | `admin` | Full access to Admin Dashboard and Product CRUD |
| **`admin1@test.com`** | `admin1234` | `admin` | Secondary administrator account |
| **`user@test.com`** | `user123` | `user` | Regular customer access to Catalog, Cart & Checkout |
| **`user1@test.com`** | `user1234` | `user` | Secondary customer account |

---

## 🏃 Getting Started

### Prerequisites
Make sure you have Node.js (version 18+ recommended) and npm installed.

### Installation
1. Clone this repository to your local directory.
2. Open terminal and run:
   ```bash
   npm install
   ```

### Running the Application Locally
To start the development server, run:
```bash
npm start
```
Once started, navigate to `http://localhost:4200/` in your browser.

### Building for Production
To compile the application and bundle the optimized static files into `dist/` directory, run:
```bash
npm run build
```

### Running Tests
To execute unit tests using the Karma test runner, run:
```bash
npm run test
```

---

## 📡 API Details

The project utilizes the public **DummyJSON API** (`https://dummyjson.com/products`) to fetch catalog data and simulate database operations:
* `GET /products` — Fetch all base products
* `GET /products/categories` — Get available taxonomy categories
* `GET /products/category/:name` — Query items from a specific category
* `GET /products/search?q=:query` — Text search
* `POST /products/add` — Mock add product
* `PUT /products/:id` — Mock update product details
* `DELETE /products/:id` — Mock delete product

