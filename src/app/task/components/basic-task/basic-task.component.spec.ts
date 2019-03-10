import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTaskComponent } from './basic-task.component';

describe('BasicTaskComponent', () => {
  let component: BasicTaskComponent;
  let fixture: ComponentFixture<BasicTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
