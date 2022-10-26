 import { Component, OnDestroy, OnInit } from '@angular/core';
 import { FormGroup, FormBuilder, Validators } from '@angular/forms'
 import { Router } from '@angular/router';
 import { AuthService } from 'src/app/services/auth.service';
 import Swal from 'sweetalert2';

 import { Store } from '@ngrx/store'
 import { AppState } from 'src/app/app.reducer'

 import { Subscription } from 'rxjs'
 import * as ui from 'src/app/shared/ui.actions'

 @Component({
     selector: 'app-register',
     templateUrl: './register.component.html',
     styleUrls: ['./register.component.css']
 })
 export class RegisterComponent implements OnInit, OnDestroy {

     registroForm!: FormGroup
     cargando: boolean = false
     uiSubscription!: Subscription

     constructor(
         private fb: FormBuilder,
         private authService: AuthService,
         private router: Router,
         private store: Store<AppState>,
     ) { }

     ngOnInit(): void {
         this.registroForm = this.fb.group({
             nombre: ['', Validators.required],
             correo: ['', [Validators.required, Validators.email]],
             password: ['', Validators.required],
         })
         this.uiSubscription = this.store.select('ui')
         .subscribe(ui => {
             this.cargando = ui.isloading
             console.log('cargando subs')
         })

     }
     ngOnDestroy(): void {
         this.uiSubscription.unsubscribe()
     }
     crearUsuario(){
         if (this.registroForm.invalid){
             return
         }
        //  Swal.fire({
        //      title: 'Espere por favor',

        //      timerProgressBar: true,
        //      didOpen: () => {
        //          Swal.showLoading()
        //      }
        //  })

         const {nombre, correo, password} = this.registroForm.value

         this.authService.crearUsuario(nombre, correo, password)
             .then(credenciales => {
                 console.log(credenciales)
                 //Swal.close()
                 this.store.dispatch(ui.isLoading())
                 this.router.navigate(['/'])
             })
             .catch( err=> {
                 this.store.dispatch(ui.isLoading())
                 Swal.fire({
                 icon: 'error',
                 title: 'Oops...',
                 text: err.message,
             })
         })
     }
 }
