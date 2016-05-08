import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { DashboardAppComponent } from '../app/dashboard.component';

beforeEachProviders(() => [DashboardAppComponent]);

describe('App: Dashboard', () => {
  it('should create the app',
      inject([DashboardAppComponent], (app: DashboardAppComponent) => {
    expect(app).toBeTruthy();
  }));

});
