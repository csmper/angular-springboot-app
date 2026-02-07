import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthResponse } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const routerSpy = { navigate: jest.fn() };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should store token and username', (done) => {
    const credentials = { username: 'u', password: 'p' };
    const mockResp: AuthResponse = { token: 't', type: 'Bearer', username: 'u', email: 'e' };

    service.login(credentials).subscribe(resp => {
      expect(resp).toEqual(mockResp);
      expect(localStorage.getItem('token')).toBe('t');
      expect(localStorage.getItem('username')).toBe('u');
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResp);
  });

  it('logout should clear storage and navigate', () => {
    localStorage.setItem('token', 't');
    localStorage.setItem('username', 'u');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('isLoggedIn should reflect token presence', () => {
    localStorage.removeItem('token');
    expect(service.isLoggedIn()).toBe(false);
    localStorage.setItem('token', 't');
    expect(service.isLoggedIn()).toBe(true);
  });
});
