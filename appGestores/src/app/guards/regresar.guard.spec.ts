import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { regresarGuard } from './regresar.guard';

describe('regresarGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => regresarGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
