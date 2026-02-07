import { TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { asyncScheduler, observeOn, of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
	let component: RegisterComponent;
	let authServiceMock: any;
	let routerMock: any;

	beforeEach(async () => {
		authServiceMock = {
			register: jest.fn()
		};

		routerMock = {
			navigate: jest.fn(),
			events: of(), // Prevents RouterLink from crashing
			serializeUrl: jest.fn(),
			createUrlTree: jest.fn().mockReturnValue({})
		};

		await TestBed.configureTestingModule({
			imports: [RegisterComponent, FormsModule],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: Router, useValue: routerMock },
				{
					provide: ActivatedRoute,
					useValue: { snapshot: { paramMap: new Map() } }
				}
			]
		}).compileComponents();

		const fixture = TestBed.createComponent(RegisterComponent);
		component = fixture.componentInstance;
		// fixture.detectChanges(); // Not always needed immediately in zoneless
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show error if passwords do not match', () => {
		component.user = { username: 'test', email: 't@t.com', password: 'password123' };
		component.confirmPassword = 'differentPassword';

		component.onSubmit();

		expect(component.errorMessage).toBe('Passwords do not match');
		expect(authServiceMock.register).not.toHaveBeenCalled();
	});

	describe('Successful Registration', () => {
		beforeEach(() => {
			jest.useFakeTimers(); // Intercept setTimeout
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should set success message and navigate after 2 seconds', async () => {
			const userData = { username: 'test', email: 't@t.com', password: '123' };
			component.user = userData;
			component.confirmPassword = '123';

			// Force the observable to be asynchronous
			authServiceMock.register.mockReturnValue(of({}).pipe(observeOn(asyncScheduler)));

			component.onSubmit();

			// 1. Verify we entered the loading state
			expect(component.isLoading).toBe(true);

			// 2. Wait for the asyncScheduler to emit and the subscribe block to run
			// In many Jest/Zoneless setups, we need to advance the fake timers 
			// or wait for the stable state.
			jest.advanceTimersByTime(0);
			await Promise.resolve(); // Flush microtasks triggered by the timer

			// 3. Now it should be finished
			expect(component.isLoading).toBe(false);
			expect(component.successMessage).toContain('Registration successful');

			// 4. Fast-forward for the actual 2-second setTimeout
			jest.advanceTimersByTime(2000);
			expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
		});
	});

	describe('Failed Registration', () => {
		it('should set error message on server error', async () => {
			component.user = { username: 'test', email: 't@t.com', password: '123' };
			component.confirmPassword = '123';

			const errorResponse = { error: { message: 'Email already exists' } };
			authServiceMock.register.mockReturnValue(throwError(() => errorResponse));

			component.onSubmit();

			await Promise.resolve(); // Flush microtasks

			expect(component.isLoading).toBe(false);
			expect(component.errorMessage).toBe('Email already exists');
		});

		it('should set error message on server null error message', async () => {
			component.user = { username: 'test', email: 't@t.com', password: '123' };
			component.confirmPassword = '123';

			const errorResponse = { error: { message: null } };
			authServiceMock.register.mockReturnValue(throwError(() => errorResponse));

			component.onSubmit();

			await Promise.resolve(); // Flush microtasks

			expect(component.isLoading).toBe(false);
			expect(component.errorMessage).toBe('Registration failed. Please try again.');
		});
	});
});