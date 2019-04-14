import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUpdateInformationComponent } from './profile-update-information.component';

describe('ProfileUpdateInformationComponent', () => {
  let component: ProfileUpdateInformationComponent;
  let fixture: ComponentFixture<ProfileUpdateInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUpdateInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUpdateInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
