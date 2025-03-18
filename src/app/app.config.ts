import { ApplicationConfig, provideZoneChangeDetection,importProvidersFrom  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';

export const appConfig: ApplicationConfig = {
  providers: [  provideZoneChangeDetection({ eventCoalescing: true }),
                provideRouter(routes), 
                importProvidersFrom(HttpClientModule,CommonModule,NgxPaginationModule)
             ]
};
