 import { NgModule } from '@angular/core'
 import { BrowserModule } from '@angular/platform-browser'

 import { AngularFireModule} from '@angular/fire/compat'
 import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
 import { AngularFireAuthModule } from "@angular/fire/compat/auth"

 import { AppRoutingModule } from './app-routing.module'
 import { ReactiveFormsModule } from '@angular/forms'
 
 import { AppComponent } from './app.component';
 import { environment } from 'src/environments/environment'

 import { StoreModule } from '@ngrx/store'
 import { StoreDevtoolsModule } from '@ngrx/store-devtools'
 import { appReducers } from './app.reducer'
 import { OrdenIngresoPipe } from './pipes/orden-ingreso.pipe'

 //Importing módules
 import { AuthModule } from './auth/auth.module'
 import { SharedModule } from './shared/shared.module';


 @NgModule({
     declarations: [
     AppComponent,
  ],
  imports: [
     BrowserModule,
     AuthModule,
     
     SharedModule,
     AppRoutingModule,
     ReactiveFormsModule,
     AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFirestoreModule,
     AngularFireAuthModule,
     StoreModule.forRoot(appReducers),
     StoreDevtoolsModule.instrument({
         maxAge: 25,
         logOnly: environment.production,
     })
 ],
 providers: [],
 bootstrap: [AppComponent]
})
export class AppModule { }
