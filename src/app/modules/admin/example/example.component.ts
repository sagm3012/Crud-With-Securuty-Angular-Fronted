import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { UserService } from 'app/core/user/user.service';
import { UserModel } from 'app/core/models/userModel';
import { InputTextModule } from 'primeng/inputtext';
@Component({
    selector     : 'example',
    standalone:true,
    styleUrls: ['./example.component.scss'],
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    providers:[ MessageService],
    imports:[ReactiveFormsModule, CommonModule,InputTextModule,ToastModule,MessagesModule]
})
export class ExampleComponent implements OnInit
{
    users:UserModel[]=[];
    employeeForm: FormGroup;
    visible = false;
    item:UserModel = new UserModel;
    /**
     * Constructor
     */
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private matdialog: MatDialog,
    public dialogRef: MatDialogRef<ExampleComponent>,
    private userService: UserService,
    private messageService: MessageService
    ) {
        console.log(data);
        this.item = data !=null ? data:new UserModel();
    }
    ngOnInit(): void {
        console.log(this.item)
        this.employeeForm = new FormGroup({
            id : new FormControl(this.item.id||0, Validators.required),
            firstName : new FormControl(this.item.firstName, Validators.required),
            secondName: new FormControl(this.item.secondName, Validators.required),
            midleName : new FormControl(this.item.midleName, Validators.required),
            PINFL : new FormControl(this.item.jShShIR, [Validators.required, Validators.maxLength(14), Validators.minLength(14)] ),
            passportSerie: new FormControl(this.item.passportSerie, [Validators.required, Validators.maxLength(2), Validators.minLength(2)]),
            passportNumber : new FormControl(this.item.passportNumber, [Validators.required, Validators.maxLength(7), Validators.minLength(7)]),
            region : new FormControl(this.item.region, Validators.required),
            mobilePhone: new FormControl(this.item.mobilePhone, [Validators.required, Validators.minLength(9)]),
            homePhone   : new FormControl(this.item.homePhone, Validators.required),
            email: new FormControl(this.item.email, Validators.required),
            gender: new FormControl(this.item.gender, Validators.required),
            dateOfBirth: new FormControl(this.item.dateOfBirth, Validators.required),
            userName: new FormControl(this.item.userName, Validators.required),
            passwordHash: new FormControl(this.item.passwordHash, Validators.required),
            confirmPassword: new FormControl(this.item.passwordHash, Validators.required)
        });
        console.log(this.employeeForm);
    }
    setPassportNumber(event) {
        this.employeeForm.get('passportNumber').setValue(event.value.toString());
    }

    close(){
        this.dialogRef.close();
        this.visible = false;
    }
    save(){
        console.log(`form: `, this.employeeForm);
        let user  = new UserModel();
        user.firstName = this.employeeForm.get('firstName').value;
        user.secondName = this.employeeForm.get('secondName').value;
        user.midleName = this.employeeForm.get('midleName').value;
        user.gender = this.employeeForm.get('gender').value;
        user.region = this.employeeForm.get('region').value;
        user.dateOfBirth = this.employeeForm.get('dateOfBirth').value;
        user.email = this.employeeForm.get('email').value;
        user.mobilePhone = this.employeeForm.get('mobilePhone').value;
        user.homePhone = this.employeeForm.get('homePhone').value;
        user.passportNumber = this.employeeForm.get('mobilePhone').value;
        user.passportSerie = this.employeeForm.get('passportSerie').value;
        user.passportNumber = this.employeeForm.get('passportNumber').value;
        user.jShShIR = this.employeeForm.get('PINFL').value;
        user.userName = this.employeeForm.get('userName').value;
        user.passwordHash = this.employeeForm.get('passwordHash').value;
        var data = this.employeeForm.getRawValue();
        data.passportNumber = data.passportNumber.toString();
        data.jShShIR = data.jShShIR.toString();
        data.mobilePhone = data.mobilePhone.toString()
        data.homeNumber = data.homeNumber.toString();

        console.log(this.item)
        if(data.id==0){
            if(this.employeeForm.get('confirmPassword').value == this.employeeForm.get('passwordHash').value){
                this.userService.addUser(data).subscribe(res=>{
                    if(res==2){
                        this.userService.loadCustomers({
                               first:0,
                               rows:10
                            })
                        this.dialogRef.close(1);

                        console.log('Saved successfully');
                    }
                    else{
                        console.log("User was found");
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'This Username was already used' });
                    }
                })
            }
        }
        if(data.id>0){
            console.log("user need to update, whose ID = "+ this.item.id)
            this.userService.updateUser(data, this.item.id).subscribe(data=>{
                if(data==2){
                    console.log("User Updated Successfully");
                    this.userService.loadCustomers({
                        first:0,
                        rows:10
                    })
                    this.dialogRef.close(1);
                   // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated Successfully'});
                }
                else{
                    console.log("User Was Not Updated");
                    this.userService.loadCustomers({
                        first:0,
                        rows:10
                    })
                    this.dialogRef.close(2);
                    //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Is Not Updated'});
                }
            })
            console.log("id:"+ this.item);
        }
      //  this.dialogRef.close();
    }
}
