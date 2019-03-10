import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTaskUpdateComponent } from './basic-task-update.component';

describe('BasicTaskUpdateComponent', () => {
  let component: BasicTaskUpdateComponent;
  let fixture: ComponentFixture<BasicTaskUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicTaskUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicTaskUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
