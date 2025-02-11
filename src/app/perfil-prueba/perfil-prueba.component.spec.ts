import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPruebaComponent } from './perfil-prueba.component';

describe('PerfilPruebaComponent', () => {
  let component: PerfilPruebaComponent;
  let fixture: ComponentFixture<PerfilPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPruebaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
