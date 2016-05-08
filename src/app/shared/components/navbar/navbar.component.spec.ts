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
import { NavbarComponent } from './navbar.component';

describe('Component: Navbar', () => {
  beforeEachProviders(() => [NavbarComponent]);
  
  it('should create the component', inject([NavbarComponent], (component: NavbarComponent) => { 
    expect(component).toBeTruthy(); 
  })); 
});
