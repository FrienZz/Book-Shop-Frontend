// angular import
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { email, Field, form, minLength, required } from '@angular/forms/signals';
import Swal from 'sweetalert2';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/theme/shared/service/user';
import { AuthService } from 'src/app/theme/shared/service/auth';

@Component({
  selector: 'app-auth-signin',
  imports: [CommonModule, RouterModule, SharedModule, Field],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent {
  private cd = inject(ChangeDetectorRef);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  submitted = signal(false);
  showPassword = signal(false);
  role = signal(['สมาชิก', 'พนักงานร้าน', 'ผู้ดูแล']);

  loginModel = signal<{ email: string; password: string }>({
    email: '',
    password: ''
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'อีเมลห้ามเว้นว่างไว้' });
    email(schemaPath.email, { message: 'รูปแบบอีเมลไม่ถูกต้อง' });
    required(schemaPath.password, { message: 'รหัสผ่านห้ามเว้นว่างไว้' });
    minLength(schemaPath.password, 8, { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' });
  });

  resetForm() {
    this.loginModel.set({
      email: '',
      password: ''
    });
  }

  onSubmit(event: Event) {
    this.submitted.set(true);
    event.preventDefault();
    if (this.loginForm().valid()) {
      this.userService.loginUsers(this.loginModel()).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: res.message,
            confirmButtonText: 'ตกลง'
          });
          this.resetForm();
          this.submitted.set(false);
          this.authService.setAuthToken(res.token);
          if (res.role_type === 'สมาชิก') {
            this.router.navigate(['member']);
          } else if (res.role_type === 'ผู้ดูแล' || res.role_type === 'พนักงานร้าน') {
            this.router.navigate(['admin']);
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: err.error.message,
            confirmButtonText: 'ตกลง'
          });
        }
      });
    }
    /** 
    const credentials = this.loginModal();
    console.log('login user logged in with:', credentials);
    this.cd.detectChanges();*/
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}
