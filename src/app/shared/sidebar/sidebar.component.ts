 import { Component, OnDestroy, OnInit } from '@angular/core'
 import { AuthService } from 'src/app/services/auth.service'
 import { Store } from '@ngrx/store'
 import { Router } from '@angular/router'
 import { AppState } from 'src/app/app.reducer'

 import { Subscription } from 'rxjs'
 import { filter } from 'rxjs/operators'


 @Component({
     selector: 'app-sidebar',
     templateUrl: './sidebar.component.html',
     styleUrls: ['./sidebar.component.css']
 })
export class SidebarComponent implements OnInit, OnDestroy {

     nombre: string = ''
     userSubs: Subscription

     constructor(
         private authService: AuthService,
         private router: Router,
         private store: Store<AppState>
     ) { }

     ngOnInit(): void {
         this.userSubs = this.store.select('user')
         .pipe(
             filter( ({user}) => user != null )
         )
         .subscribe( ({ user }) => this.nombre = user.nombre )
     }

     ngOnDestroy() {
         this.userSubs.unsubscribe();
      }
     logout(){
         this.authService.logout().then(()=> {
             this.router.navigate(['/login'])
         })
     }

}
