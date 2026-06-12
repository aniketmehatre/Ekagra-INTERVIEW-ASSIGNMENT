import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { CatalogComponent } from './features/shop/catalog/catalog';
import { ProductDetail } from './features/shop/product-detail/product-detail';
import { Cart } from './features/shop/cart/cart';
import { Checkout } from './features/shop/checkout/checkout';
import { ShopShellComponent } from './features/shop/shop-shell/shop-shell';
import { DashboardComponent } from './features/admin/dashboard/dashboard';
import { ProductManagementComponent } from './features/admin/product-management/product-management.component';
import { checkoutGuard } from './features/shop/checkout/checkout-guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        component: DashboardComponent,
        canActivate: [
            authGuard,
            adminGuard
        ]
    },
    {
        path: 'admin/products',
        component: ProductManagementComponent,
        canActivate: [
            authGuard,
            adminGuard
        ]
    },
    {
        path: 'shop',
        component: ShopShellComponent,
        canActivate: [
            authGuard
        ],
        children: [
            {
                path: '',
                component: CatalogComponent,
            },
            {
                path: 'cart',
                component: Cart,
            },
            {
                path: 'products/:id',
                component: ProductDetail,
            },
            {
                path: 'checkout/step/:n',
                component: Checkout,
                canActivate: [checkoutGuard],
            },
            {
                path: 'order-confirmation/:id',
                component: Checkout,
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];