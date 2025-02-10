import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCardCategoriaComponent } from './book-card-categoria.component';

describe('BookCardCategoriaComponent', () => {
  let component: BookCardCategoriaComponent;
  let fixture: ComponentFixture<BookCardCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCardCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
