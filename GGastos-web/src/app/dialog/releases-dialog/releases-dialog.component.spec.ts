import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesDialogComponent } from './releases-dialog.component';

describe('ReleasesDialogComponent', () => {
  let component: ReleasesDialogComponent;
  let fixture: ComponentFixture<ReleasesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReleasesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
