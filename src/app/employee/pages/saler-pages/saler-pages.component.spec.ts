import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalerPagesComponent } from './saler-pages.component';

describe('SalerPagesComponent', () => {
  let component: SalerPagesComponent;
  let fixture: ComponentFixture<SalerPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalerPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalerPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
