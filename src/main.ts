import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { NewsComponent } from './app/news.component';

bootstrapApplication(NewsComponent, appConfig)
  .catch((err) => console.error(err));
