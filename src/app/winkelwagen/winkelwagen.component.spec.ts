import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinkelwagenComponent } from './winkelwagen.component';

describe('WinkelwagenComponent', () => {
  let component: WinkelwagenComponent;
  let fixture: ComponentFixture<WinkelwagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinkelwagenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinkelwagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
