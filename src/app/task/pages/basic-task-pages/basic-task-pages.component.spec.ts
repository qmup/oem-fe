import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTaskPagesComponent } from './basic-task-pages.component';

describe('BasicTaskPagesComponent', () => {
  let component: BasicTaskPagesComponent;
  let fixture: ComponentFixture<BasicTaskPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicTaskPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicTaskPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
