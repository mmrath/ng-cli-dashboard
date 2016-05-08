import {
  async,
  beforeEachProviders,
  describe,
  ddescribe,
  expect,
  iit,
  it,
  inject
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { LoginComponent } from './login.component';

describe('Component: Login', () => {
  beforeEachProviders(() => [LoginComponent]);
  
  it('should create the component', inject([LoginComponent], (component: LoginComponent) => { 
    expect(component).toBeTruthy(); 
  })); 
});
