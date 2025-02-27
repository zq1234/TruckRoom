import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  builder = inject(FormBuilder);
  httpService = inject(HttpService);
  router = inject(Router);
  loginForm = this.builder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onLogin() {
    const username = this.loginForm.value.username!;
    const password = this.loginForm.value.password!;
    this.httpService.login(username, password).subscribe((result) => {
      console.log(result);
      localStorage.setItem('token', result.token);
      this.router.navigateByUrl('/');
    });
  }
}
