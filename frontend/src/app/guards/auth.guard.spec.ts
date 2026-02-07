import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  it('allows navigation when logged in', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isLoggedIn: () => true } },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    expect(result).toBe(true);
  });

  it('redirects to login when not logged in', () => {
    const navigate = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isLoggedIn: () => false } },
        { provide: Router, useValue: { navigate } }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));
    expect(result).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
