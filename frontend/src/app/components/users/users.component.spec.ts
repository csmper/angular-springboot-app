import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UsersComponent } from './users.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

describe('UsersComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        { provide: UserService, useValue: { getAllUsers: jest.fn(() => of([])), deleteUser: jest.fn(() => of({})) } },
        { provide: AuthService, useValue: { currentUser$: of('u'), logout: jest.fn() } }
      ]
    });
  });

  it('creates and loads users', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    expect(comp).toBeTruthy();
    expect(comp.users).toEqual([]);
  });
});
