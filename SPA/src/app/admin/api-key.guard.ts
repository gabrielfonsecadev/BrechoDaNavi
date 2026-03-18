import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const apiKeyGuard: CanActivateFn = () => {
    const router = inject(Router);
    const key = localStorage.getItem('brecho_api_key');
    if (key && key.trim().length > 0) {
        return true;
    }
    router.navigate(['/admin']);
    return false;
};
