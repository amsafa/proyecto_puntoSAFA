import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarCompraComponent } from './pagar-compra.component';

describe('PagarCompraComponent', () => {
  let component: PagarCompraComponent;
  let fixture: ComponentFixture<PagarCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagarCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
