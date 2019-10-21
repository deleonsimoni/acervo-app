import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors, FormBuilder } from '@angular/forms';


import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private builder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  passwordsMatchValidator(control: FormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }

  userForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
  })



  get fullname(): any { return this.userForm.get('fullname'); }
  get email(): any { return this.userForm.get('email'); }
  get password(): any { return this.userForm.get('password'); }
  get repeatPassword(): any { return this.userForm.get('repeatPassword'); }

  register() {

    if (!this.userForm.valid) return;

    let {
      fullname,
      email,
      password,
      repeatPassword
    } = this.userForm.getRawValue();

    this.authService.register(fullname, email, password, repeatPassword)
      .subscribe(data => {
        this.router.navigate(['']);
      })
  }

  private createForm(): void {

    this.registerForm = this.builder.group({
      fullname: [null, [Validators.required]],
      // tslint:disable-next-line: max-line-length
      email: [null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      cfPassword: [null, [Validators.required, Validators.minLength(6)]],
      dateBirth: [null, [Validators.required]],
      icForeign: [false],
      isPCD: [false],
      deficiencyType: [null],
      document: [null, [Validators.required]],
      address: this.builder.group({
        street: [null, [Validators.required]],
        num: [null, [Validators.required]],
        complement: [null],
        zip: [null, [Validators.required]],
        city: [null, [Validators.required]],
        district: [null, [Validators.required]],
        country: [null, [Validators.required]],
        state: [null, [Validators.required]]
      }),
      phones: this.builder.group({
        telephone: [null],
        cellphone: [null, [Validators.required]],
      }),
      icAcceptTerms: [false, [Validators.requiredTrue]]
    });
  }

}
