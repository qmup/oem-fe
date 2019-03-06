import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPagesComponent } from './company-pages.component';

describe('CompanyPagesComponent', () => {
  let component: CompanyPagesComponent;
  let fixture: ComponentFixture<CompanyPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
