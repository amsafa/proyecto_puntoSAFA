import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDeLibroComponent } from './detalle-de-libro.component';

describe('DetalleDeLibroComponent', () => {
  let component: DetalleDeLibroComponent;
  let fixture: ComponentFixture<DetalleDeLibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleDeLibroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleDeLibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
