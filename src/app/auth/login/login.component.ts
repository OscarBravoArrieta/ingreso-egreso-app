 import { Component, OnInit } from '@angular/core'
 import { FormGroup, FormBuilder, Validators } from '@angular/forms'
 import { Router } from '@angular/router'
 import Swal from 'sweetalert2'

 import { AuthService } from 'src/app/services/auth.service'

 @Component({
     selector: 'app-login',
     templateUrl: './login.component.html',
     styleUrls: ['./login.component.css']
 })
 export class LoginComponent implements OnInit {

     loginForm!: FormGroup

     constructor(
         private fb: FormBuilder,
         private auth: AuthService,
         private router: Router
     ) { }

     ngOnInit(): void {
         this.loginForm = this.fb.group({
             email: ['', [Validators.required, Validators.email]],
             password: ['', Validators.required],
         })
     }
     login(): void {

         if (this.loginForm.invalid){
             return
         }

         Swal.fire({
             title: 'Espere por favor',
             timerProgressBar: true,
             didOpen: () => {
                 Swal.showLoading()
             }
         })
         const {email, password} = this.loginForm.value
         this.auth.login(email, password)
             .then(credenciales => {
             Swal.close();
             this.router.navigate(['/'])
         })
         .catch( err=> {
             Swal.fire({
                 icon: 'error',
                 title: 'Oops...',
                 text: err.message,
             })
         })
     }
 }
