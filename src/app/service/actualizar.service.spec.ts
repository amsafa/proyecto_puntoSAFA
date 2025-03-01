import { TestBed } from '@angular/core/testing';

import { ActualizarHeaderService } from './actualizar.service';

describe('ActualizarHeaderService', () => {
  let service: ActualizarHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualizarHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
