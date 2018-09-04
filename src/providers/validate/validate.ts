import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable()
export class ValidateProvider {

  constructor(public http: HttpClient) {
  }

  validateRegister(user) {
    if (user.name == undefined || user.email == undefined || user.password == undefined)
      return false;
    else return true;
  }

  validateEmail(c: FormControl): { [key: string]: string } | null {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(c.value)) {
          return { 'emailInvalid': "*Please use valid email address" };
      }
      return null;
  }

  validatePasswordRep(password: string, passwordRep: string): ValidatorFn {
      return (group: FormGroup): { [key: string]: boolean } | null => {
          let password = group.controls['password'];
          let confirmPassword = group.controls['passwordRep'];

          if (password.value != confirmPassword.value) {

              return { 'passwordRepInvalid': true };
          };
          return null;
      };
  }

  getFormValidationErrors(form, frmControl, nameDisplay, sign) {
      var msg = "";
      let flag = false;

      Object.keys(form.controls).forEach(key => {
          const controlErrors: ValidationErrors = form.get(key).errors;
          if (controlErrors != null) {
              Object.keys(controlErrors).forEach(keyError => {
                  //console.log('Key control: ' + key + ', value: ' + form.controls[key].value + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                  if (flag == false && frmControl == key && keyError == "required") {
                      flag = true;
                      msg = "*" + nameDisplay + " is required.";
                  }
                  else if (flag == false && frmControl == key && keyError == "minlength") {
                      flag = true;
                      msg = "*" + nameDisplay + " must be at least " + controlErrors[keyError].requiredLength + " characters long.";
                  }
                  else if (flag == false && frmControl == key && keyError == "min") {
                      flag = true;
                      msg = "*" + nameDisplay + " must be minimum " + controlErrors[keyError].min + sign;
                  }
                  else if (flag == false && frmControl == key && keyError == "max") {
                      flag = true;
                      msg = "*" + nameDisplay + " must be maximum " + controlErrors[keyError].max + sign;
                  }
                  else if (flag == false && frmControl == key) {
                      flag = true;
                      msg = controlErrors[keyError];
                  }
              });
          }
      });

      return msg;
  }

  buildFormData(form,formData) {

      Object.keys(form.controls).forEach(key => {
          if (key != 'pic')
          {
              //console.log(key + ":" + form.controls[key].value);
              formData.append(key, form.controls[key].value);
          }
      });

      return formData;
  }

}
