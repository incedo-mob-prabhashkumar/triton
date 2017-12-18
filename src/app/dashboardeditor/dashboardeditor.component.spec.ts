import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardeditorComponent } from './dashboardeditor.component';

describe('DashboardeditorComponent', () => {
  let component: DashboardeditorComponent;
  let fixture: ComponentFixture<DashboardeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
