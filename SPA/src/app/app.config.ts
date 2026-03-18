import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ADMIN_ROUTES } from './admin/admin.routes';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { HomeComponent } from './home/home.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'admin',
        loadChildren: () => Promise.resolve(ADMIN_ROUTES)
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent
      }
    ], withInMemoryScrolling({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    }))
  ]
};
