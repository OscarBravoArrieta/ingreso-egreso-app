 import { Injectable } from '@angular/core'
 import { AngularFireAuth } from "@angular/fire/compat/auth"
 import { AngularFirestore } from '@angular/fire/compat/firestore'
 import { map } from 'rxjs/operators'
 import { Usuario } from '../models/usuario.model'
 import { Store } from '@ngrx/store'
 import { AppState } from '../app.reducer'
 import * as authActions from '../auth/auth.actions'
 import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions'
 import { Subscription } from 'rxjs'

 @Injectable({
     providedIn: 'root'
 })
 export class AuthService {
     userSubscription: Subscription
     private _user: Usuario
     
     get user() {
         return this._user;
     }

     constructor(
         public auth: AngularFireAuth,
         public firestore: AngularFirestore,
         private store: Store<AppState>
     ) { }
     initAuthListener(){
         this.auth.authState.subscribe(fuser => {
              
              if (fuser){
                 this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
                     .subscribe((firestoreUser: any) => {
                         const user = Usuario.fromFirebase(firestoreUser)
                         this._user = user
                         this.store.dispatch(authActions.setUser({user: user}))
                         this.store.dispatch(ingresoEgresoActions.unSetItems())
                     })
              }else {
                 this._user = null
                 this.userSubscription?.unsubscribe()
                 this.store.dispatch(authActions.unSetUser())

              }
         })
     }
     crearUsuario(nombre: string, email: string, password: string){
         return this.auth.createUserWithEmailAndPassword(email, password)
             .then(({user}) =>{
                 const newUser = new Usuario (user?.uid, nombre, email)
                 return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser})
             })
     }
     login(email: string, password: string){
         return this.auth.signInWithEmailAndPassword(email, password)
     }
     logout(){
         return this.auth.signOut()
     }
     isAuth():any {
         return this.auth.authState.pipe(
             map(fbUser => fbUser != null)
         )
     }
 }
