import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborerPagesComponent } from './laborer-pages.component';

describe('LaborerPagesComponent', () => {
  let component: LaborerPagesComponent;
  let fixture: ComponentFixture<LaborerPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaborerPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborerPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
