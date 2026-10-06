import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login implements OnInit {

  loginData = { username: '', password: '' };

  loading = signal<boolean>(false);
  error   = signal<string>('');

  constructor(
    private authService: AuthService,
    private router:      Router
  ) {}

  ngOnInit() {
    console.log('🔐 Login initialisé');
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    this.authService.login(
      this.loginData.username,
      this.loginData.password
    ).subscribe({
      next: (res: any) => {
        this.authService.saveSession(res.token, res.user);
        this.loading.set(false);
        this.router.navigate(['/home']); // ✅ corrigé
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Identifiants incorrects');
      }
    });
  }
}