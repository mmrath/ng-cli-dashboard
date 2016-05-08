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
import { FooterComponent } from './footer.component';

describe('Component: Footer', () => {
  beforeEachProviders(() => [FooterComponent]);
  
  it('should create the component', inject([FooterComponent], (component: FooterComponent) => { 
    expect(component).toBeTruthy(); 
  })); 
});
