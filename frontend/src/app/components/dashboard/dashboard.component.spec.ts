import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { provideRouter } from '@angular/router'; // Import provideRouter
import { of } from 'rxjs';

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;

	const mockAuthService = {
		currentUser$: of('TestUser'),
		logout: jest.fn()
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DashboardComponent],
			providers: [
				{ provide: AuthService, useValue: mockAuthService },
				// provideRouter fixes the "reading root" error by providing 
				// a real router state for RouterLink to use.
				provideRouter([])
			]
		}).compileComponents();

		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;


		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should navigate or logout correctly', () => {
		component.logout();
		expect(mockAuthService.logout).toHaveBeenCalled();
	});

	it('ngOnInit should subscribe to currentUser$ and set username', (done) => {
		// Re-create component to test ngOnInit lifecycle
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;

		expect(component.username).toBe(''); // Initial value

		fixture.detectChanges(); // Triggers ngOnInit

		// Check that username was set from the mock observable
		expect(component.username).toBe('TestUser');
		done();
	});

	it('ngOnInit should handle null currentUser$ value', (done) => {
		// Create a mock that returns null
		const nullMockAuthService = {
			currentUser$: of(null),
			logout: jest.fn()
		};

		TestBed.resetTestingModule();
		TestBed.configureTestingModule({
			imports: [DashboardComponent],
			providers: [
				{ provide: AuthService, useValue: nullMockAuthService },
				provideRouter([])
			]
		});

		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		// Should set username to empty string when null
		expect(component.username).toBe('');
		done();
	});
});