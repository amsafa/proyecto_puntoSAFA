import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecomendacionLibroComponent } from './recomendacion-libro.component';

describe('RecomendacionLibroComponent', () => {
  let component: RecomendacionLibroComponent;
  let fixture: ComponentFixture<RecomendacionLibroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecomendacionLibroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecomendacionLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
