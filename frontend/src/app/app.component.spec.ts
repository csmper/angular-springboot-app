import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent],
			providers: [
				provideRouter([]) // Provides dependencies for RouterOutlet
			]
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it(`should have the 'Angular SpringBoot App' title`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app.title).toEqual('Angular SpringBoot App');
	});

	it('should render a router outlet', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();

		// Check if the router-outlet directive is present in the DOM
		const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
		expect(outlet).toBeTruthy();
	});
});