import { Component, OnInit, ViewEncapsulation, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {
  Country
} from '../validators';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatTabGroup, MatTabHeader, MatTab } from '@angular/material';


@Component({
  selector: 'app-forms-page',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormsComponent implements OnInit {

  @ViewChild('tabs') tabs: MatTabGroup;
  tab1Form: FormGroup;
  tab2Form: FormGroup;
  description = 'Form Validation';
  selected = new FormControl(0);
  country_group: FormGroup;
  countries = [
    new Country('CAN', 'Canada'),
    new Country('CHN', 'China')
  ];
  nSave1 = 0;
  nSave2 = 0;
  validation_messages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cannot be more than 20 characters long' }
    ],
    phone: [
      { type: 'required', message: 'Phone is required' },
      { type: 'pattern', message: 'Enter a valid phone. Format: 416-555-5555' }
    ],
    calender: [
      { type: 'required', message: 'Please insert your birthday' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ]
  };

  account_validation_messages = {
    address1: [
      { type: 'required', message: 'Address1 is required'}
    ],
    address2: [
      { type: 'required', message: 'Address2 is required'}
    ],
    city: [
      { type: 'required', message: 'City is required'}
    ],
    province: [
      { type: 'required', message: 'Province is required'}
    ],
    postal: [
      { type: 'required', message: 'Postal code is required' },
      { type: 'pattern', message: 'Enter a valid postal code. format: a1a1a1' }
    ]
  };

  constructor(private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {
    this.createForms();
    this.tabs._handleClick = this.interceptTabChange.bind(this);
  }

  createForms() {
    // country validation
    const country = new FormControl(this.countries[0], Validators.required);
    this.country_group = new FormGroup({
      country
    });

    // user details form validations
    this.tab1Form = this.fb.group({
      name: ['', Validators.compose([
        Validators.maxLength(20),
        Validators.required
      ]) ],
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^\d{3}[\-]\d{3}[\-]\d{4}$/)
      ])),
      calender: ['', Validators.required]
    });
    // user links form validations
    this.tab2Form = this.fb.group({
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      postal: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]$/)
      ])),
      country: this.country_group
    });

  }

  onSubmitForm1(value) {
    console.log(value);
    this.nSave1 = 1;
  }
  onSubmitForm2(value) {
    console.log(value);
    this.nSave2 = 1;
  }

  interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, idx: number) {
    let bReturn = true;
    if (this.tab1Form.getRawValue().name !== '' || this.tab1Form.getRawValue().email !== '' || this.tab1Form.getRawValue().phone !== '') {
      if ( this.selected.value === 0 && idx === 1) {
        if ( this.tab1Form.valid ) {
          if (this.nSave1 === 0) {
            bReturn = false;
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              width: '350px',
              data: 'Are you going to save data of form 1?'
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.onSubmitForm1(this.tab1Form.value);
              }
              this.nSave1 = 1;
              this.selected.setValue(1);
            });
          }
        } else {
          bReturn = false;
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: 'Are you going to go to Form 2 without saving data of form 1?'
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.createForms();
              this.selected.setValue(1);
            } else {
              this.selected.setValue(0);
              this.nSave1 = 0;
            }
          });
        }
      }
    }
    if (this.tab2Form.getRawValue().address1 !== '' || this.tab2Form.getRawValue().address2 !== '' || this.tab2Form.getRawValue().city !== '' || this.tab2Form.getRawValue().province !== '' || this.tab2Form.getRawValue().postal !== '')
    {
      if ( this.selected.value === 1 && idx === 0) {
        if (this.tab2Form.valid ) {
          if (this.nSave2 === 0) {
            bReturn = false;
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              width: '350px',
              data: 'Are you going to save data of form 2?'
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.onSubmitForm2(this.tab2Form.value);
              }
              this.nSave2 = 1;
              this.selected.setValue(0);
            });
          }
        } else {
          bReturn = false;
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: 'Are you going to go to Form 1 without saving data of form 2?'
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.createForms();
              this.selected.setValue(0);
            } else {
              this.selected.setValue(1);
              this.nSave2 = 0;
            }
          });
        }
      }
    }
    return bReturn && MatTabGroup.prototype._handleClick.apply(this.tabs, arguments);
  }

  onSearchChange2() {
    this.nSave2 = 0;
  }
  onSearchChange1() {
    this.nSave1 = 0;
  }
}
