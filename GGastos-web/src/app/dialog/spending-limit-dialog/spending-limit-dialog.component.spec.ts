import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingLimitDialogComponent } from './spending-limit-dialog.component';

describe('SpendingLimitDialogComponent', () => {
  let component: SpendingLimitDialogComponent;
  let fixture: ComponentFixture<SpendingLimitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendingLimitDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendingLimitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
