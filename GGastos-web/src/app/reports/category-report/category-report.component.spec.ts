import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryReportComponent } from './category-report.component';

describe('CategoryReportComponent', () => {
  let component: CategoryReportComponent;
  let fixture: ComponentFixture<CategoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
