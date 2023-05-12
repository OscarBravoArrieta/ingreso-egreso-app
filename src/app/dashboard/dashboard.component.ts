 import { Component, OnDestroy, OnInit } from '@angular/core'
 import { Store } from '@ngrx/store'
 import { AppState } from '../app.reducer'
 import { filter } from 'rxjs/operators'
 import { Subscription } from 'rxjs'
 import { IngresoEgresoService } from '../services/ingreso-egreso.service'

 import * as IngresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions'

 @Component({
     selector: 'app-dashboard',
     templateUrl: './dashboard.component.html',
     styleUrls: ['./dashboard.component.css']
 })
 export class DashboardComponent implements OnInit, OnDestroy {
     
     userSubs: Subscription
     ingresoEgresosSubs: Subscription
     
     constructor(
         private store: Store<AppState>,
         private ingresoEgresoService: IngresoEgresoService
     ) { }

     ngOnInit() {
         this.userSubs = this.store.select('user')
             .pipe(
                 filter(auth => auth.user != null)
             )
             .subscribe( ({user}) => {                 
                 this.ingresoEgresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
                     .subscribe((ingresosEgresosFB: any) =>{
                         this.store.dispatch(IngresoEgresoActions.setItems({items: ingresosEgresosFB}))
                     })
             })
     }
     ngOnDestroy(){
         this.ingresoEgresosSubs.unsubscribe()
         this.userSubs.unsubscribe()
     }
 }
