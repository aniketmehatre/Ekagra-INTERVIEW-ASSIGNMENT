# Quick Start Guide - Product Management Module

## Access the Application

### 1. Start Development Server
```bash
npm start
# Server runs on http://localhost:4200
```

### 2. Login
- Navigate to http://localhost:4200
- Login with credentials (check your auth system)

### 3. Access Product Management
```
http://localhost:4200/admin/product-management
```

## Features Overview

### 🔍 **Search Products**
- Type in the search box (top left)
- Results update automatically with 400ms debounce
- Searches product titles and descriptions

### 📂 **Filter by Category**
- Select category from dropdown
- Categories load dynamically from API
- Combine with search for advanced filtering

### ➕ **Add New Product**
- Click "Add New Product" button
- Fill in form fields:
  - **Product Title** (min 3 characters)
  - **Category** (select from dropdown)
  - **Price** (must be > 0)
  - **Stock** (must be >= 0)
  - **Description** (min 10 characters)
  - **Image URL** (must be valid HTTPS URL)
- Image preview updates in real-time
- Click "Add Product" to save

### ✏️ **Edit Product**
- Click "Edit" button on any row
- Form opens in edit mode with current values
- Update any field
- Click "Update Product" to save

### 🗑️ **Delete Product**
- Click "Delete" button
- Confirm deletion
- Product removed instantly (optimistic update)

## Table Columns

| Column | Description |
|--------|-------------|
| ID | Unique product identifier |
| Image | Product thumbnail (60x60px) |
| Name | Product title with rating |
| Category | Colored badge with category name |
| Price | Product price in dollars |
| Stock | Current stock quantity |
| Status | Availability badge (In Stock / Low Stock / Out of Stock) |
| Actions | Edit and Delete buttons |

## Status Badges

- **✅ In Stock** - Stock > 5 (Green)
- **⚠️ Low Stock** - Stock 1-5 (Yellow)
- **❌ Out of Stock** - Stock = 0 (Red)

## Keyboard Shortcuts

- `Tab` - Navigate between fields
- `Enter` - Submit form
- `Escape` - Close modal
- Click outside modal - Close modal

## Mobile Responsive

- ✅ Fully responsive on all devices
- ✅ Touch-friendly buttons and controls
- ✅ Optimized table for mobile viewing
- ✅ Stacked layout on small screens

## Error Handling

- **API Errors**: Displayed in red alert banner
- **Form Errors**: Red text under field with specific message
- **Delete Rollback**: Automatically restores product if delete fails

## Loading State

- Skeleton loaders appear while loading products
- No spinners or jarring animations
- Smooth shimmer effect

## Browser Compatibility

- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

## API Endpoints

All endpoints use **https://dummyjson.com/products**

- `GET /products` - Fetch all products (~30 products)
- `GET /products/search?q=query` - Search products
- `GET /products/categories` - Get all categories
- `GET /products/category/:name` - Filter by category

## Troubleshooting

### Products not loading?
- Check browser console for errors
- Verify network connectivity
- Check if dummyjson.com is accessible

### Search not working?
- Make sure search box has focus
- Type at least 1 character
- Wait for 400ms debounce

### Images not showing?
- Image URL must start with `https://`
- URL must be valid and accessible
- Check image path is correct

### Form validation failing?
- Title: minimum 3 characters
- Description: minimum 10 characters
- Price: must be greater than 0
- Stock: must be 0 or greater
- Image URL: must be valid HTTPS URL

## Performance Tips

- Search is automatically debounced (400ms)
- Only filtered results are rendered
- Skeleton loaders improve perceived performance
- Change detection optimized with OnPush strategy

## Next Steps

1. Customize API endpoints to your backend
2. Add authentication tokens if needed
3. Implement server-side pagination
4. Add sorting capabilities
5. Add bulk operations
6. Set up error tracking and logging

## Support

For detailed documentation, see `PRODUCT_MANAGEMENT_README.md`
