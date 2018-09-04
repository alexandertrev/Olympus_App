import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginPage } from '../pages';
import { ValidateProvider, AuthProvider } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    private fb: FormBuilder,
    private validateProvider: ValidateProvider,
    private authProvider: AuthProvider) {

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, this.validateProvider.validateEmail]],
      password: ['', Validators.required],
      passwordRep: ['', Validators.required]
    },
      { validator: this.validateProvider.validatePasswordRep('password', 'passwordRep') });
  }

  doSignup() {
    console.log("Form status: " + this.form.status);

    if (this.form.status == "INVALID") {
      this.form.controls['name'].markAsDirty();
      this.form.controls['email'].markAsDirty();
      this.form.controls['password'].markAsDirty();
      this.form.controls['passwordRep'].markAsDirty();
      return false;
    }
    const user = {
      name: this.form.controls['name'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value
    }
    // Register user
    this.submitAttempt = true;
    this.authProvider.registerUser(user).subscribe(data => {
      if (data["success"]) {
        let toast = this.toastCtrl.create({
          message: data["message"],
          duration: 3000,
          position: 'bottom',
          cssClass: 'toast-success'
        });
        toast.present();
        this.navCtrl.remove(1)
        this.navCtrl.push(LoginPage);
      }
      else {
        let toast = this.toastCtrl.create({
          message: data["error"],
          duration: 3000,
          position: 'bottom',
          cssClass: 'toast-error'
        });
        toast.present();
      }
    });
  }
}
