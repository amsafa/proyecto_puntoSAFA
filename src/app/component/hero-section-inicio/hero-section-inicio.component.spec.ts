import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeroSectionInicioComponent } from './hero-section-inicio.component';

describe('HeroSectionInicioComponent', () => {
  let component: HeroSectionInicioComponent;
  let fixture: ComponentFixture<HeroSectionInicioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeroSectionInicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
