// angular import
import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/theme/shared/service/auth';
import { UserService } from 'src/app/theme/shared/service/user';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  my_profile = signal(null);
  // public props

  // constructor
  constructor() {
    const config = inject(NgbDropdownConfig);

    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.userService.getMyProfile().subscribe((res) => {
      this.my_profile.set(res.data);
    });
  }

  logOut() {
    this.authService.removeAuthToken();
    this.router.navigate(['login']);
  }
}
