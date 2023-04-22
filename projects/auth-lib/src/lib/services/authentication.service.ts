import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../interfaces/user';

@Injectable()
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(private router: Router, private toastr: ToastrService) {
        this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser')!));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    register(user: User): void {
        const registeredUsers = localStorage.getItem("users");
        console.log(registeredUsers);
        
        if (registeredUsers) {
            const parsedUsers = JSON.parse(registeredUsers);
            const userRegistered = parsedUsers.find((x: User) => x.email === user.email);
            if (userRegistered) {
                this.toastr.info("This user already exists");
            } else {
                parsedUsers.push(user);
                this.registeredSuccess(parsedUsers);
            }
        } else {
            this.registeredSuccess([user]);
        }
    }

    registeredSuccess(data: User[]): void {
        localStorage.setItem("users", JSON.stringify(data));
        this.toastr.success("User Registered successfully!");

        this.router.navigate(['/login']);
    }

    login(email: string, password: string): void {
        const registeredUsers = JSON.parse(localStorage.getItem("users")!);
        const userRegistered = registeredUsers.find((x: User) => x.email === email && x.password === password)
        if (userRegistered) {
            localStorage.setItem('currentUser', JSON.stringify(userRegistered));
            this.currentUserSubject.next(userRegistered);
            this.toastr.success("Successfull Login!");
            this.router.navigate(['/']);
        } else {
            this.toastr.error("User was not found");
        }
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }


}