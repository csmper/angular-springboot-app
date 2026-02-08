import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from './auth.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://angular-springboot-app.onrender.com/api/users';

  const mockUsers: User[] = [
    { id: 1, username: 'jdoe', email: 'jdoe@example.com' } as User,
    { id: 2, username: 'asmith', email: 'asmith@example.com' } as User
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsers', () => {
    it('should return an Observable of users', (done) => {
      service.getAllUsers().subscribe((users) => {
        expect(users.length).toBe(2);
        expect(users).toEqual(mockUsers);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a single user by ID', (done) => {
      const mockUser = mockUsers[0];
      
      service.getUserById(1).subscribe((user) => {
        expect(user).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('createUser', () => {
    it('should post the new user and return it', (done) => {
      const newUser = { username: 'newguy' } as User;

      service.createUser(newUser).subscribe((user) => {
        expect(user).toEqual(newUser);
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(newUser);
    });
  });

  describe('updateUser', () => {
    it('should send a PUT request with the updated user', (done) => {
      const updatedUser = { id: 1, username: 'updated' } as User;

      service.updateUser(1, updatedUser).subscribe((user) => {
        expect(user).toEqual(updatedUser);
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should send a DELETE request', (done) => {
      service.deleteUser(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});