import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { DashboardAppComponent, environment } from './app/';

import 'rxjs/Rx'; // Add all operators to Observable
import {DIRECTIVES, PIPES, PROVIDERS} from './app/shared';


if (environment.production) {
  enableProdMode();
}

bootstrap(DashboardAppComponent, [
  ...PROVIDERS,
  ...DIRECTIVES,
  ...PIPES,
]
).catch(err => console.error(err));
