import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';
import { DirectivaComponent } from './directiva/directiva.component';
import { DirectivaService } from './directiva/directiva.service';
import { FormComponent } from './clientes/form/form.component';
import { FormsModule } from '@angular/forms';
import {registerLocaleData } from "@angular/common";
import localeES from '@angular/common/locales/es';
import { PaginatorComponent } from './paginator/paginator.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { authGuard } from './usuarios/guards/auth.guard';

registerLocaleData(localeES,'es')

const routes:Routes=[
  {path: '', redirectTo: '/clientes',pathMatch:'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'clientes/form', component: FormComponent, canActivate: [authGuard]},
  {path: 'clientes/form/:id', component: FormComponent, canActivate: [authGuard]},
  {path: 'login', component: LoginComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    DirectivaComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NoopAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    
  ],
  providers: [ClienteService, DirectivaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
