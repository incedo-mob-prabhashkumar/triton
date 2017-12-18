import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridselectionComponent } from './gridselection.component';

describe('GridselectionComponent', () => {
  let component: GridselectionComponent;
  let fixture: ComponentFixture<GridselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
