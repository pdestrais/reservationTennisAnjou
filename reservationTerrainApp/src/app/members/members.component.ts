import { User } from './../model/user';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { AlertService } from '../service/alert.service';
import { Subject } from 'rxjs/Subject';
import { ConfirmationService } from 'primeng/api';

const confirmPwdValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newpwd = control.get('newPassword');
  const confirmpwd = control.get('confirmationPassword');

  return newpwd && confirmpwd && newpwd.value != confirmpwd.value ? { confirmpwdnotequalnewpwd: true } : null;
};

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {
  public users: User[] = [];
  public selectedUser: User = new User();
  public displayDialog: boolean = false;
  public editDialog: boolean = false;
  public changePwdDialog: boolean = false;
  public model: any = {};
  public loading = false;
  public currentPassword: string = '';
  public newPassword: string = '';
  public confirmationPassword: string = '';

  public loggedInUser: any;

  public memberForm!: FormGroup;
  public changePwdForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.memberForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: [
        '',
        [Validators.required, Validators.minLength(6), Validators.pattern('^[a-z]+$'), this.noWhitespaceValidator],
      ],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      address: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.changePwdForm = new FormGroup(
      {
        currentPassword: new FormControl(this.currentPassword, [Validators.required]),
        newPassword: new FormControl(this.newPassword, [Validators.required]),
        confirmationPassword: new FormControl(this.confirmationPassword, [Validators.required]),
      },
      { validators: confirmPwdValidator }
    );

    this.userService.getAll().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.log(error);
        this.alertService.error(error);
      }
    );
    this.loggedInUser = JSON.parse(localStorage.getItem('currentUser')!);
    if (this.route.snapshot.paramMap.get('changePwd')) {
      this.changeUserPwd(this.loggedInUser);
    }
  }

  noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? { whitespace: true } : null;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.memberForm.controls;
  }

  get fp() {
    return this.changePwdForm.controls;
  }

  get cpf() {
    return this.changePwdForm;
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.displayDialog = true;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.memberForm.setValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      address: user.address,
      phone: user.phone,
      username: user.username,
    });
    this.editDialog = true;
  }

  changeUserPwd(user: User): void {
    this.selectedUser = user;
    this.model = user;
    this.changePwdDialog = true;
  }

  deleteUser(user: User): void {
    this.confirmationService.confirm({
      /* target: event.target, */
      message: 'Etes-vous s??r de vouloir effectuer cette op??ration ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.delete(user._id, user._rev).subscribe(
          (data) => {
            console.log('user deleted');
            this.alertService.success('Membre supprim??');
            this.ngOnInit();
          },
          (error) => {
            console.log('problem deleting user');
            this.alertService.error(error);
          }
        );
      } /* ,
      reject: () => {
        this.alertService.success('test');
        console.log('delete canceled');
      }, */,
    });
  }

  update() {
    this.loading = true;
    this.selectedUser = { ...this.selectedUser, ...this.memberForm.value };
    this.userService.update(this.selectedUser).subscribe(
      (data) => {
        console.log('user data success');
        this.alertService.success('Mise ?? jour r??ussie', true);
        this.router.navigate(['/members']);
        /*          let docs = data.rows.map((row) => {
              this.users.push(row.doc);
          }) 
*/
      },
      (error) => {
        console.log(error);
        this.alertService.error(error);
      }
    );
    this.loading = false;
    this.editDialog = false;
  }

  updatePwd() {
    this.selectedUser = this.model;
    this.newPassword = this.changePwdForm.controls.newPassword.value;
    this.currentPassword = this.changePwdForm.controls.currentPassword.value;
    this.confirmationPassword = this.changePwdForm.controls.confirmationPassword.value;
    if (this.newPassword != this.confirmationPassword) {
      this.alertService.error('Les nouveaux deux mots de passe ne sont pas les m??mes.');
      this.loading = false;
    } else {
      this.loading = true;
      this.userService.updatePwd(this.model, this.currentPassword, this.newPassword).subscribe(
        (data) => {
          this.alertService.success('Mise ?? jour r??ussie', true);
          this.router.navigate(['/members']);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    }
    this.changePwdDialog = false;
  }

  onDialogHide() {
    this.displayDialog = false;
    this.editDialog = false;
    this.changePwdDialog = false;
    //this.selectUser = null;
    //this.model = null;
  }
}
