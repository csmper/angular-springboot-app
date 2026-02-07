import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router'; // Import provideRouter
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let router: Router; // Reference to the real router instance

	const MockSuccessfulLoginResponse = {
		token: 'fake-jwt-token',
		type: 'Bearer',
		username: 'TestUser',
		email: 'testuser@example.com'
	};

	const MockRouter = {
		navigate: jest.fn().mockResolvedValue(true),
		events: of(), // Add this to prevent RouterLink from crashing
		serializeUrl: jest.fn().mockReturnValue(''),
		createUrlTree: jest.fn().mockReturnValue({})
	};

	const mockAuthService = {
		login: jest.fn().mockReturnValue(of(MockSuccessfulLoginResponse))
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LoginComponent],
			providers: [
				{ provide: AuthService, useValue: mockAuthService },
				{ provide: Router, useValue: MockRouter },
				{ provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;

		// Inject the real router from TestBed so we can spy on it
		router = TestBed.inject(Router);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('onSubmit', () => {
		it('should navigate to dashboard on successful login', () => {
			// Mock the login method to return an observable that emits a value
			mockAuthService.login = jest.fn().mockReturnValue(of(MockSuccessfulLoginResponse));

			// Spy on the router's navigate method
			const navigateSpy = jest.spyOn(router, 'navigate');

			// Call the onSubmit method
			component.onSubmit();

			// Expect the navigate method to have been called with the correct route
			expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
		});
	});

	it('should set errorMessage on failed login', () => {
		// Mock the login method to return an observable that errors out
		mockAuthService.login = jest.fn().mockReturnValue(throwError(() => new Error('Login failed')));

		// Call the onSubmit method
		component.onSubmit();

		// Expect the errorMessage to be set
		expect(component.errorMessage).toBe('Login failed. Please check your credentials.');
	});
});