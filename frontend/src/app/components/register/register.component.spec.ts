import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let navigate: jest.Mock;

  beforeEach(() => {
    navigate = jest.fn();
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: { register: jest.fn(() => of({})), } },
        { provide: Router, useValue: { navigate } }
      ]
    });
  });

  it('creates and can submit with matching passwords', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;
    comp.user = { username: 'u', email: 'e', password: 'p' };
    comp.confirmPassword = 'p';
    comp.onSubmit();
    expect(comp.isLoading).toBe(true);
  });
});
