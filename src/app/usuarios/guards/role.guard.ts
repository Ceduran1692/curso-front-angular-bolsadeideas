import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService= inject(AuthService);
  const router= inject(Router);
  let role= route.data["role"] as string;
  let canActivate;

  if(authService.isAuthenticated()){
    canActivate= true;
    if(authService.isTokenExpired()){
      canActivate= false
      authService.logOut;
      router.navigate(['/login']);
    }
  
  }else{
    router.navigate(['/login'])
    canActivate= false
  }

  if(canActivate == true && !authService.hasRole(role)){
      canActivate= false;
      Swal.fire('Acceso denegado', `Disculpa ${authService.usuario.nombre} pero no tienes accceso`, 'warning');
      router.navigate(['/clientes']);
    }

  
  return canActivate;
};
