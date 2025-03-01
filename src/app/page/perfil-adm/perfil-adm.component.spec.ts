import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAdmComponent } from './perfil-adm.component';

describe('PerfilAdmComponent', () => {
  let component: PerfilAdmComponent;
  let fixture: ComponentFixture<PerfilAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilAdmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
