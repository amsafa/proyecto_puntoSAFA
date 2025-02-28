import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ Importa animaciones
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // ✅ Habilita animaciones
    importProvidersFrom(HttpClientModule), // ✅ Importa HttpClientModule correctamente
    provideRouter(routes), // ✅ Configura rutas
    ...appConfig.providers // ✅ Incluye los demás providers de appConfig
  ]
}).catch(err => console.error(err));
