import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookatComponent } from './lookat.component';

describe('LookatComponent', () => {
  let component: LookatComponent;
  let fixture: ComponentFixture<LookatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LookatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
