import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUpdateAvatarComponent } from './profile-update-avatar.component';

describe('ProfileUpdateAvatarComponent', () => {
  let component: ProfileUpdateAvatarComponent;
  let fixture: ComponentFixture<ProfileUpdateAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUpdateAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUpdateAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
