import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuscadorInicioComponent } from './buscador-inicio.component';

describe('BuscadorInicioComponent', () => {
  let component: BuscadorInicioComponent;
  let fixture: ComponentFixture<BuscadorInicioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BuscadorInicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
