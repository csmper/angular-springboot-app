import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(() => {
    // 1. Create the mock for AuthService
    authServiceMock = {
      getToken: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        // 2. Register the interceptor within the HttpClient pipeline
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header when a token is present', (done) => {
    const mockToken = 'my-secret-token';
    authServiceMock.getToken.mockReturnValue(mockToken);

    // Make a dummy request
    httpClient.get('/api/test').subscribe(() => {
      done();
    });

    // Verify the request
    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({});
  });

  it('should NOT add an Authorization header when token is missing', (done) => {
    authServiceMock.getToken.mockReturnValue(null);

    httpClient.get('/api/test').subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });
});