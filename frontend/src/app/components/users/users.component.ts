import { Component, inject, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  username = '';

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.username = user || '';
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
        // console.error('Error loading users:', error);
      }
    });
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user';
          // console.error('Error deleting user:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
