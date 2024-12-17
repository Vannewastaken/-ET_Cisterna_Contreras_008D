import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AutorizadoGuard } from './guards/autorizado.guard';
import { RegresarGuard } from './guards/regresar.guard';

import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [RegresarGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canActivate: [RegresarGuard]
  },
  {
    path: 'register2',
    loadChildren: () => import('./pages/register2/register2.module').then( m => m.Register2PageModule),
    canActivate: [RegresarGuard]
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [AutorizadoGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [AutorizadoGuard]
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./pages/recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule),
    canActivate: [RegresarGuard]
  },
  {
    path: 'recuperar-contrasena2',
    loadChildren: () => import('./pages/recuperar-contrasena2/recuperar-contrasena2.module').then( m => m.RecuperarContrasena2PageModule),
    canActivate: [RegresarGuard]
  },
  {
    path: 'eventos',
    loadChildren: () => import('./pages/eventos/eventos.module').then( m => m.EventosPageModule),
    canActivate: [AutorizadoGuard]
  },
  {
    path: 'gestionar-eventos',
    loadChildren: () => import('./pages/gestionar-eventos/gestionar-eventos.module').then( m => m.GestionarEventosPageModule),
    canActivate: [AutorizadoGuard]
  },
  {
    path: 'mensajes',
    loadChildren: () => import('./pages/mensajes/mensajes.module').then( m => m.MensajesPageModule),
    canActivate: [AutorizadoGuard]
  },
  {
    path: 'modificar-evento/:id',
    loadChildren: () => import('./pages/modificar-evento/modificar-evento.module').then( m => m.ModificarEventoPageModule),
    canActivate: [AutorizadoGuard]
  },
  {
    path: 'crear-evento',
    loadChildren: () => import('./pages/crear-evento/crear-evento.module').then( m => m.CrearEventoPageModule),
    canActivate: [AutorizadoGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [AutorizadoGuard]
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./pages/editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  {
    path: 'qr-scanner',
    loadChildren: () => import('./pages/qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
