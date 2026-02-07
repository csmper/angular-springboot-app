import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';

describe('App Routes', () => {
	let authServiceMock: any; // Using any for brevity in mock setup

	beforeEach(() => {
		authServiceMock = {
			isLoggedIn: jest.fn(),
			// Add this to satisfy DashboardComponent's ngOnInit
			currentUser$: of('test-user')
		};

		TestBed.configureTestingModule({
			providers: [
				provideRouter(routes),
				{ provide: AuthService, useValue: authServiceMock }
			]
		});
	});

	it('should navigate to login by default (empty path)', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl('');
		expect(TestBed.inject(Router).url).toBe('/login');
	});

	it('should redirect unknown routes to login', async () => {
		const harness = await RouterTestingHarness.create();
		await harness.navigateByUrl('/some-random-page');
		expect(TestBed.inject(Router).url).toBe('/login');
	});

	describe('Guard Protection', () => {
		it('should allow navigation to users when user is logged in', async () => {
			authServiceMock.isLoggedIn.mockReturnValue(false);
			const harness = await RouterTestingHarness.create();

			await harness.navigateByUrl('/register');
			expect(TestBed.inject(Router).url).toBe('/register');
		});

		it('should allow navigation to dashboard when user is logged in', async () => {
			authServiceMock.isLoggedIn.mockReturnValue(true);
			const harness = await RouterTestingHarness.create();

			await harness.navigateByUrl('/dashboard');

			expect(TestBed.inject(Router).url).toBe('/dashboard');
		});

		it('should allow navigation to users when user is logged in', async () => {
			authServiceMock.isLoggedIn.mockReturnValue(true);
			const harness = await RouterTestingHarness.create();

			await harness.navigateByUrl('/users');
			expect(TestBed.inject(Router).url).toBe('/users');
		});

		it('should redirect to login when accessing dashboard while logged out', async () => {
			authServiceMock.isLoggedIn.mockReturnValue(false);
			const harness = await RouterTestingHarness.create();

			// We try to go to dashboard, but guard should kick us back
			await harness.navigateByUrl('/dashboard');

			expect(TestBed.inject(Router).url).toBe('/login');
		});

		it('should protect the users route with authGuard', async () => {
			authServiceMock.isLoggedIn.mockReturnValue(false);
			const harness = await RouterTestingHarness.create();

			await harness.navigateByUrl('/users');

			expect(TestBed.inject(Router).url).toBe('/login');
		});
	});
});