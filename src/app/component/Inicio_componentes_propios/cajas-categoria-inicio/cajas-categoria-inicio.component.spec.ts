import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CajasCategoriaInicioComponent } from './cajas-categoria-inicio.component';

describe('CajasCategoriaInicioComponent', () => {
  let component: CajasCategoriaInicioComponent;
  let fixture: ComponentFixture<CajasCategoriaInicioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CajasCategoriaInicioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CajasCategoriaInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
