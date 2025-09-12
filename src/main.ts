// En src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// Importa Bootstrap solo en el cliente
if (typeof window !== 'undefined') {
  import('bootstrap/dist/js/bootstrap.bundle.min.js');
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
