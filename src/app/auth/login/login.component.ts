 import { Component, OnDestroy, OnInit } from '@angular/core'
 import { FormGroup, FormBuilder, Validators } from '@angular/forms'
 import { Router } from '@angular/router'
 import Swal from 'sweetalert2'
 import { Store } from '@ngrx/store'
 import { AppState } from 'src/app/app.reducer'


 import { AuthService } from 'src/app/services/auth.service'
 import { Subscription } from 'rxjs'
 import * as ui from 'src/app/shared/ui.actions'

 @Component({
     selector: 'app-login',
     templateUrl: './login.component.html',
     styleUrls: ['./login.component.css']
 })
 export class LoginComponent implements OnInit, OnDestroy {

     loginForm!: FormGroup
     cargando: boolean = false
     uiSubscription!: Subscription

     constructor(
         private fb: FormBuilder,
         private auth: AuthService,
         private router: Router,
         private store: Store<AppState>,
     ) { }

     ngOnInit(): void {
         this.loginForm = this.fb.group({
             email: ['', [Validators.required, Validators.email]],
             password: ['', Validators.required],
         })
         this.uiSubscription = this.store.select('ui')
             .subscribe(ui => {
                 this.cargando = ui.isLoading
             })
     }

     ngOnDestroy(): void {
         this.uiSubscription.unsubscribe()
     }

     login(): void {

         if (this.loginForm.invalid){
             return
         }

         this.store.dispatch(ui.isLoading())

        //  Swal.fire({
        //      title: 'Espere por favor',
        //      timerProgressBar: true,
        //      didOpen: () => {
        //          Swal.showLoading()
        //      }
        //  })
         const {email, password} = this.loginForm.value
         this.auth.login(email, password)
             .then(credenciales => {
             //Swal.close();
             this.store.dispatch(ui.stopLoading())
             this.router.navigate(['/'])
         })
         .catch( err=> {
             this.store.dispatch(ui.stopLoading())
             Swal.fire({
                 icon: 'error',
                 title: 'Oops...',
                 text: err.message,
             })
         })
     }
 }
