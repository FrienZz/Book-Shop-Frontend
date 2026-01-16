// angular import
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { email, Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import Swal from 'sweetalert2';
// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/theme/shared/service/user';

@Component({
  selector: 'app-auth-signup',
  imports: [CommonModule, RouterModule, SharedModule, Field],
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent {
  private cd = inject(ChangeDetectorRef);
  private userService = inject(UserService);
  private router = inject(Router);

  submitted = signal(false);
  showPassword = signal(false);

  /**
  registerModel = signal<{ email: string; password: string; username: string }>({
    email: '',
    password: '',
    username: ''
  }); */

  registerModel = signal<{ firstname: string; lastname: string; email: string; password: string; phone_number: string }>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone_number: ''
  });

  /**
  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.email, { message: 'อีเมลห้ามเว้นว่างไว้' });
    email(schemaPath.email, { message: 'รูปแบบอีเมลไม่ถูกต้อง' });
    required(schemaPath.password, { message: 'รหัสผ่านห้ามเว้นว่างไว้' });
    minLength(schemaPath.password, 8, { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' });
    required(schemaPath.username, { message: 'Username is required' });
  }); */

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.firstname, { message: 'ชื่อห้ามเว้นว่างไว้' });
    required(schemaPath.lastname, { message: 'นามสกุลห้ามเว้นว่างไว้' });
    required(schemaPath.email, { message: 'อีเมลห้ามเว้นว่างไว้' });
    email(schemaPath.email, { message: 'รูปแบบอีเมลไม่ถูกต้อง' });
    required(schemaPath.password, { message: 'รหัสผ่านห้ามเว้นว่างไว้' });
    minLength(schemaPath.password, 8, { message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร' });
    required(schemaPath.phone_number, { message: 'เบอร์โทรศัพท์ห้ามเว้นว่างไว้' });
    minLength(schemaPath.phone_number, 10, { message: 'เบอร์โทรศัพท์ต้องมี 10 หลัก' });
    maxLength(schemaPath.phone_number, 10, { message: 'เบอร์โทรศัพท์ต้องมี 10 หลัก' });
  });

  resetForm() {
    this.registerModel.set({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phone_number: ''
    });
  }

  onSubmit(event: Event) {
    this.submitted.set(true);
    event.preventDefault();
    if (this.registerForm().valid()) {
      this.userService.registerUsers(this.registerModel()).subscribe((res) => {
        Swal.fire({
          icon: 'success',
          title: res.message,
          text: 'คุณได้ทำการลงทะเบียนสำเร็จแล้ว',
          confirmButtonText: 'ตกลง'
        });
      });
      this.resetForm();
      this.submitted.set(false);
      this.router.navigate(['login']);
    }
    /**
    const credentials = this.registerModel();
    console.log('register user logged in with:', credentials);
    this.cd.detectChanges(); */
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}
