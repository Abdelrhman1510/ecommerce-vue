# E-Commerce Vue Admin Dashboard

A complete Vue 3 + Vite admin dashboard application that connects to a Laravel backend API. Features authentication, product management, and order management.

## Features

- **Authentication**: Login and registration with JWT token-based authentication
- **Dashboard**: Display key metrics (total products and orders)
- **Products Management**: Full CRUD operations with modal forms
- **Orders Management**: View all orders with detailed breakdown of items
- **Protected Routes**: Navigation guard to protect authenticated pages
- **Axios Interceptors**: Automatic token injection and 401 error handling
- **Responsive Design**: Mobile-friendly UI with modern styling
- **Pinia State Management**: Centralized auth state management

## Project Structure

```
ecommerce-vue/
├── src/
│   ├── api/
│   │   └── axios.js          # Axios instance with interceptors
│   ├── components/
│   ├── pages/
│   │   ├── Login.vue         # Login page
│   │   ├── Register.vue      # Registration page
│   │   ├── Dashboard.vue     # Dashboard with stats
│   │   ├── Products.vue      # Products management
│   │   └── Orders.vue        # Orders management
│   ├── router/
│   │   └── index.js          # Vue Router configuration
│   ├── store/
│   │   └── auth.js           # Pinia auth store
│   ├── App.vue               # Root component
│   └── main.js               # Application entry point
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── .env.example              # Environment variables template
```

## Installation

### Prerequisites

- Node.js 14+ and npm/yarn
- A running Laravel backend API

### Step 1: Clone/Setup the Project

```bash
cd ecommerce-vue
```

### Step 2: Install Dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

### Step 3: Configure Backend URL

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and update the backend API URL:

```env
VITE_API_URL=http://localhost:8000/api
```

Replace `http://localhost:8000/api` with your actual Laravel backend API URL.

## Running the Project

### Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Page Descriptions

### Login Page (`/login`)
- Email and password form
- Posts to `POST /api/auth/login`
- Stores JWT token in localStorage
- Redirects to dashboard on success
- Link to registration page

### Register Page (`/register`)
- Name, email, and password form
- Posts to `POST /api/auth/register`
- Redirects to login on success
- Link to login page

### Dashboard (`/dashboard`)
- Displays total products count (from `GET /api/products`)
- Displays total orders count (from `GET /api/orders`)
- Simple card-based layout
- Protected route (requires authentication)

### Products Page (`/products`)
- Table view of all products
- Create product button with modal form
- Edit product functionality
- Delete product functionality
- Form fields: name, price, stock, description
- Protected route (requires authentication)

### Orders Page (`/orders`)
- Table view of all orders
- View details button opens modal
- Order details include:
  - Customer name
  - Order status (pending, completed, cancelled)
  - Order date/time
  - Itemized list with product name, quantity, price
  - Order total
- Protected route (requires authentication)

## API Endpoints Expected

The application expects the following Laravel API endpoints:

### Authentication
- `POST /api/auth/login` - Login
  - Request: `{ email, password }`
  - Response: `{ token, user }`

- `POST /api/auth/register` - Register
  - Request: `{ name, email, password }`
  - Response: Success message

### Products
- `GET /api/products` - Get all products
  - Response: `{ data: [...] }` or array

- `POST /api/products` - Create product
  - Request: `{ name, price, stock, description }`

- `PUT /api/products/{id}` - Update product
  - Request: `{ name, price, stock, description }`

- `DELETE /api/products/{id}` - Delete product

### Orders
- `GET /api/orders` - Get all orders
  - Response: `{ data: [...] }` or array
  - Expected fields: `id, customer_name, total, status, created_at, items`
  - Items structure: `[{ product_name, quantity, price }, ...]`

## Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Token is stored in localStorage as `auth_token`
4. Axios interceptor automatically adds `Authorization: Bearer <token>` to all requests
5. On 401 response, token is cleared and user is redirected to login
6. Protected routes require authentication; unauthorized users are redirected to login

## Storage

### localStorage Keys

- `auth_token`: JWT token for API authentication

## Error Handling

- 401 Unauthorized: User is logged out and redirected to login page
- Other errors: Displayed as error messages in the UI
- Loading states provided for all async operations

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api` |

## Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Fast build tool and dev server
- **Vue Router**: Client-side routing
- **Axios**: HTTP client
- **Pinia**: State management
- **CSS3**: Styling with flexbox and grid

## Development Tips

1. **Token Debugging**: Check localStorage for `auth_token` in browser DevTools
2. **API Testing**: Use browser DevTools Network tab to inspect API calls
3. **State Debugging**: Use Vue DevTools to inspect Pinia store state
4. **Cors Issues**: If CORS errors occur, ensure your Laravel backend allows requests from frontend origin
5. **Hot Reload**: Development server automatically reloads on file changes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Issue: CORS errors
**Solution**: Configure CORS in your Laravel backend to allow requests from your frontend URL.

### Issue: 401 Unauthorized on protected routes
**Solution**: Ensure the `auth_token` is properly stored in localStorage after login.

### Issue: API not responding
**Solution**: Verify `VITE_API_URL` in `.env` matches your backend URL and the backend is running.

### Issue: Blank page after login
**Solution**: Open browser console to check for JavaScript errors. Verify router is properly configured.

## Production Deployment

1. Build the project: `npm run build`
2. The `dist/` folder contains production-ready files
3. Deploy to your hosting provider (Vercel, Netlify, GitHub Pages, etc.)
4. Update `VITE_API_URL` in production environment
5. Ensure CORS is configured in your Laravel backend for production domain

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, check the following:
1. Browser console for error messages
2. Network tab for API request/response details
3. Verify all environment variables are set correctly
4. Ensure Laravel backend API is running and accessible
