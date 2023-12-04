import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { UserModel } from '../models/userModel';
import { LazyLoadEvent } from 'primeng/api';

@Injectable({providedIn: 'root'})
export class UserService
{

    totalRecords!: number;
    loading: boolean = false;
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private apiUrl = "https://localhost:44328/";
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        //value.avatar="";
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) =>
            {
                this._user.next(user);
            }),
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) =>
            {
                this._user.next(response);
            }),
        );
    }

    addUser(item:UserModel){
        return this._httpClient.post(this.apiUrl + 'api/Users/AddUser', item);
    }
    getUsers():Observable<UserModel[]>{
        return this._httpClient.get<UserModel[]>(this.apiUrl+ 'api/Users/GetAll');
    }
    deleteUser(id:number){
        return this._httpClient.delete(this.apiUrl +`api/Users/RemoveUser/${id}`);
    }
    updateUser(item:UserModel, id:number){
        return this._httpClient.put(this.apiUrl + `api/Users/UpdateUser/${id}`, item);
    }
    getUsers2(data:any):any{
        return this._httpClient.post(this.apiUrl + 'api/Users/GetAll2', JSON.parse(data));
    }
    user2: UserModel[];
    loadCustomers(event: LazyLoadEvent) {
        console.log(event);


        this.loading = true;
        console.log("event"+event)
            this.getUsers2(JSON.stringify(event)).subscribe(res => {

                 this.user2 = res.items;
                 this.totalRecords = res.totalItems;
                this.loading = false;
            });
    }
}
