import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let navigate: jest.Mock;

  beforeEach(() => {
    navigate = jest.fn();
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: { login: jest.fn(() => of({ token: 't', type: '', username: 'u', email: 'e' })) } },
        { provide: Router, useValue: { navigate } }
      ]
    });
  });

  it('should create component and submit calls login', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();

    component.credentials = { username: 'u', password: 'p' };
    component.onSubmit();
    expect(component.isLoading).toBe(true);
  });
});
