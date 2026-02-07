import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UsersComponent } from './users.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router, provideRouter } from '@angular/router';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userService: UserService;
  let authService: AuthService;
  let router: Router;
  let mockUserService: any;
  let mockAuthService: any;

  const mockUsers = [
    { id: 1, username: 'user1', email: 'user1@test.com' },
    { id: 2, username: 'user2', email: 'user2@test.com' }
  ];

  beforeEach(async () => {
    mockUserService = {
      getAllUsers: jest.fn(() => of(mockUsers)),
      deleteUser: jest.fn(() => of({}))
    };

    mockAuthService = {
      currentUser$: of('TestUser'),
      logout: jest.fn()
    };

    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should subscribe to currentUser$ and load users', () => {
    fixture.detectChanges(); // Triggers ngOnInit

    expect(component.username).toBe('TestUser');
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.isLoading).toBe(false);
  });

  it('loadUsers should fetch users and set isLoading flag', () => {
    component.loadUsers();

    // Since of() is synchronous, by the time loadUsers() returns,
    // the subscription has already completed and isLoading is false
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    
    // After subscription completes
    expect(component.users).toEqual(mockUsers);
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('loadUsers should handle error and set errorMessage', () => {
    const errorMsg = 'Failed to load users';
    mockUserService.getAllUsers = jest.fn(() =>
      throwError(() => new Error('Network error'))
    );

    component.loadUsers();

    expect(component.errorMessage).toBe('Failed to load users');
    expect(component.isLoading).toBe(false);
  });

  it('deleteUser should call userService.deleteUser and reload users', () => {
    const userId = 1;
    global.confirm = jest.fn(() => true);

    component.deleteUser(userId);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
  });

  it('deleteUser should not call deleteUser if confirm returns false', () => {
    const userId = 1;
    global.confirm = jest.fn(() => false);

    component.deleteUser(userId);

    expect(mockUserService.deleteUser).not.toHaveBeenCalled();
  });

  it('deleteUser should not do anything if id is undefined', () => {
    component.deleteUser(undefined);

    expect(mockUserService.deleteUser).not.toHaveBeenCalled();
  });

  it('deleteUser should handle delete error gracefully', () => {
    const userId = 1;
    global.confirm = jest.fn(() => true);
    mockUserService.deleteUser = jest.fn(() =>
      throwError(() => new Error('Delete failed'))
    );

    component.deleteUser(userId);

    expect(component.errorMessage).toBe('Failed to delete user');
  });

  it('logout should call authService.logout', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should handle null username in ngOnInit', () => {
    const nullMockAuthService = {
      currentUser$: of(null),
      logout: jest.fn()
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: nullMockAuthService },
        provideRouter([])
      ]
    });

    const localFixture = TestBed.createComponent(UsersComponent);
    const localComponent = localFixture.componentInstance;
    localFixture.detectChanges();

    expect(localComponent.username).toBe('');
  });

  it('should display users list correctly', () => {
    fixture.detectChanges();

    expect(component.users.length).toBe(2);
    expect(component.users[0].username).toBe('user1');
    expect(component.users[1].email).toBe('user2@test.com');
  });
});
