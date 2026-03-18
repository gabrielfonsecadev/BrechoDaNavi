import { Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { apiKeyGuard } from './api-key.guard'
export const ADMIN_ROUTES: Routes = [
    { path: '', component: AdminLoginComponent },
    { path: 'dashboard', component: AdminDashboardComponent, canActivate: [apiKeyGuard] }
];
