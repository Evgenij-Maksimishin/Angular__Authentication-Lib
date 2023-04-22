import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../services';
import { ToastrService } from 'ngx-toastr';
import { Validators } from '@angular/forms';


@Component({
  selector: 'lib-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public registerForm!: FormGroup;
  public submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
      {
        validators: this.MustMatch('password', 'confirmPassword')
      }
    );
  }

  get name() { return this.registerForm.get('name') }
  get email() { return this.registerForm.get('email') }
  get password() { return this.registerForm.get('password') }
  get confirmPassword() { return this.registerForm.get('confirmPassword') }

  MustMatch(controlName: string, matchingControlName: string) {
    return (FormGroup: FormGroup) => {
      const control = FormGroup.controls[controlName]
      const matchingControl = FormGroup.controls[matchingControlName]

      if (matchingControl.errors && !matchingControl.errors?.['MustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MustMatch: true });
      } else {
        matchingControl.setErrors(null);

      }

    }
  }


  onFormSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    try {
      this.authService.register(this.registerForm.value);
    } catch (error: any) {
      this.toastr.error(error, 'Error');
    }
  }

}
