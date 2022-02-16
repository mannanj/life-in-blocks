import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearRowComponent } from './year-row.component';

describe('YearRowComponent', () => {
  let component: YearRowComponent;
  let fixture: ComponentFixture<YearRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
