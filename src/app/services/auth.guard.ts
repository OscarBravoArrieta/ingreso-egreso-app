 import { Injectable } from '@angular/core'
 import { CanActivate, CanLoad } from '@angular/router'
 import { Observable } from 'rxjs'
 import { tap, take } from 'rxjs/operators'
 import { AuthService } from './auth.service'
 import { Router } from '@angular/router'


 @Injectable({
     providedIn: 'root'
 })
 export class AuthGuard implements CanActivate, CanLoad {

     constructor(
         private authService: AuthService,
         private router: Router){}

     canLoad(): Observable<boolean> {
        return this.authService.isAuth()
        .pipe(
            tap(estado => {
                if(!estado) { this.router.navigate(['/login'])}
            }),
            take(1)
        )
     }

     canActivate(): Observable<boolean> {
         return this.authService.isAuth()
         .pipe(
             tap(estado => {
                 if(!estado) { this.router.navigate(['/login'])}
             })
         )
     }
 }
