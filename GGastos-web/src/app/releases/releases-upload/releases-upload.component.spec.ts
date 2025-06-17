import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesUploadComponent } from './releases-upload.component';

describe('ReleasesUploadComponent', () => {
  let component: ReleasesUploadComponent;
  let fixture: ComponentFixture<ReleasesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleasesUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
