import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = () => {
  const authService= inject(AuthService);
  const route= inject(Router);
  let canActivate;

  if(authService.isAuthenticated()){
    canActivate= true;
    if(authService.isTokenExpired()){
      canActivate= false
      authService.logOut;
      route.navigate(['/login']);
    }
  }else{
    route.navigate(['/login'])
    canActivate= false
  }

  return canActivate;
};