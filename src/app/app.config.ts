import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {httpAuthInterceptor} from './auth/http-auth.interceptor';
import {authExpiredInterceptor} from './auth/auth-expired.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpAuthInterceptor, authExpiredInterceptor])),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes)]
};
