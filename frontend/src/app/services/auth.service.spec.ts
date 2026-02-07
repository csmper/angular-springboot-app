import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, AuthResponse, LoginRequest, User } from './auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
	let service: AuthService;
	let httpMock: HttpTestingController;
	let routerMock: jest.Mocked<Router>;

	const apiUrl = 'http://localhost:8080/api/auth';

	beforeEach(() => {
		// 1. Create a mock for the Router
		routerMock = {
			navigate: jest.fn(),
			events: of(), // Essential for internal router stability
		} as unknown as jest.Mocked<Router>;

		// 2. Mock localStorage
		const store: Record<string, string> = {};
		jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);
		jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
		jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => { delete store[key]; });
		jest.spyOn(Storage.prototype, 'clear').mockImplementation(() => { for (const key in store) delete store[key]; });

		TestBed.configureTestingModule({
			providers: [
				AuthService,
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: Router, useValue: routerMock }
			],
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

	describe('register', () => {
		it('should send a POST request with the user data', (done) => {
			const newUser: User = {
				username: 'newuser',
				email: 'new@example.com',
				password: 'password123'
			};

			service.register(newUser).subscribe(response => {
				expect(response).toEqual({ message: 'User registered' });
				done();
			});

			const req = httpMock.expectOne(`${apiUrl}/register`);
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual(newUser);

			req.flush({ message: 'User registered' });
		});
	});

	describe('getToken', () => {
		it('should return the token from localStorage if it exists', () => {
			// Mock localStorage return value
			jest.spyOn(localStorage, 'getItem').mockReturnValue('fake-jwt-token');

			const token = service.getToken();

			expect(token).toBe('fake-jwt-token');
			expect(localStorage.getItem).toHaveBeenCalledWith('token');
		});

		it('should return null if no token is found', () => {
			jest.spyOn(localStorage, 'getItem').mockReturnValue(null);

			const token = service.getToken();

			expect(token).toBeNull();
		});
	});

	describe('login', () => {
		it('should store token/username and update behavior subject on success', (done) => {
			const credentials: LoginRequest = { username: 'testuser', password: 'password' };
			const mockResponse: AuthResponse = {
				token: 'fake-jwt',
				username: 'testuser',
				email: 'test@test.com',
				type: 'Bearer'
			};

			service.login(credentials).subscribe(response => {
				expect(response).toEqual(mockResponse);
				expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt');
				expect(localStorage.setItem).toHaveBeenCalledWith('username', 'testuser');

				// Verify BehaviorSubject updated
				service.currentUser$.subscribe(user => {
					expect(user).toBe('testuser');
					done();
				});
			});

			const req = httpMock.expectOne(`${apiUrl}/login`);
			expect(req.request.method).toBe('POST');
			req.flush(mockResponse);
		});
	});

	describe('logout', () => {
		it('should clear storage, update subject, and navigate to login', () => {
			// Set initial state
			localStorage.setItem('token', 'some-token');

			service.logout();

			expect(localStorage.removeItem).toHaveBeenCalledWith('token');
			expect(localStorage.removeItem).toHaveBeenCalledWith('username');
			expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);

			service.currentUser$.subscribe(user => {
				expect(user).toBeNull();
			});
		});
	});

	describe('Utility Methods', () => {
		it('should check isLoggedIn based on token existence', () => {
			jest.spyOn(service, 'getToken').mockReturnValue('exists');
			expect(service.isLoggedIn()).toBe(true);

			jest.spyOn(service, 'getToken').mockReturnValue(null);
			expect(service.isLoggedIn()).toBe(false);
		});
	});
});