import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortExplanationComponent } from './short-explanation.component';

describe('ShortExplanationComponent', () => {
  let component: ShortExplanationComponent;
  let fixture: ComponentFixture<ShortExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShortExplanationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
