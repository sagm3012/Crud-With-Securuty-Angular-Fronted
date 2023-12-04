import { Component, ViewEncapsulation, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ExampleComponent } from '../example/example.component';
import { UserService } from 'app/core/user/user.service';
import { UserModel } from 'app/core/models/userModel';
import { CommonModule} from '@angular/common'
import { LazyLoadEvent } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
    selector: 'example2',
    standalone: true,
    templateUrl: './example2.component.html',
    styleUrls: ['./example2.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers:[ConfirmationService, MessageService],
    imports:[MatDialogModule, ButtonModule,ReactiveFormsModule,TableModule, CommonModule,MessagesModule ,ToastModule,ConfirmDialogModule],

})
//DialogModule ,InputTextModule, ToastModule,ConfirmDialogModule
export class Example2Component implements OnInit {

    selectAll: boolean = false;
    selectedUsers:UserModel[]=[];
    user:UserModel[] = [];
    visible = false;
    item:UserModel = new UserModel();
    messages: Message[] | undefined;
    constructor(
        public dialog: MatDialog,
        public userService: UserService,
        private messageService: MessageService,
        private confirmationService:ConfirmationService
        ) { }
    ngOnInit(): void {
        // this.userService.loadCustomers({
        //     first:0,
        //     rows:10
        // })
    }
    showDialog() {
       const dialogRef =  this.dialog.open(ExampleComponent, {data:new UserModel()});
       dialogRef.afterClosed().subscribe((res) => {
        if(res==1){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Saved'});
        }
       });
    }

    onSelectionChange(value = []) {
        this.selectAll = value.length === this.userService.totalRecords;
        this.selectedUsers = value;
    }
    onSelectAllChange(event: any) {
        const checked = event.checked;
    }

    updateUser(user:UserModel){
        this.item = user as UserModel;
        const dialogRef =  this.dialog.open(ExampleComponent, {data:user});
        dialogRef.afterClosed().subscribe((result) => {
            if(result == 1){
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated Successfully'});
            }
            else{
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Updaet Fail'});
            }
        });

    }
    deleteUser(id:number){
        console.log("id:"+id);
        this.confirmationService.confirm({
            message: 'Do you want to delete this user',
            header: 'Delete user',
            icon: 'pi pi-info-circle',

             accept:()=>{
              this.userService.deleteUser(id).subscribe({
                next: (res)=>{
                  if(res==2){
                    this.userService.loadCustomers({
                        rows: 10,
                        first: 0
                      })
                    this.messageService.add({severity: 'success', summary: 'Summary', detail: 'User deleted'});
                  }
                  else{
                    this.messageService.add({severity: 'warning', summary: 'Summary', detail: 'Not found'});
                  }
                }
              })
            },
            reject:()=>{
              this.messageService.add({ severity: 'warn', summary: 'Task Master', detail: 'You have cancelled' });
            }
          })
          console.log("id:"+id);
}
// getAll(){
//     this.userService.getUsers().subscribe({
//         next:data=>{
//             this.user = data;
//             console.log(this.user)
//         },
//         error:error=>{
//             console.error("There was an error");
//         }
//     })
//   }

}
