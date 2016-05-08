import {
  async,
  beforeEachProviders,
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject
} from '@angular/core/testing';
import { provide } from '@angular/core';
import { LoginService } from './login.service';

describe('Login Service', () => {

  beforeEachProviders(() => [LoginService]);

  it('should ...', inject([LoginService], (service: LoginService) => {

  }));

});
