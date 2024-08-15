import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputOutputReportComponent } from './input-output-report.component';

describe('InputOutputReportComponent', () => {
  let component: InputOutputReportComponent;
  let fixture: ComponentFixture<InputOutputReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputOutputReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputOutputReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
