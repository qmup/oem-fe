import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerPagesComponent } from './manager-pages.component';

describe('ManagerPagesComponent', () => {
  let component: ManagerPagesComponent;
  let fixture: ComponentFixture<ManagerPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
