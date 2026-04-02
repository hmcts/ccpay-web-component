import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserRoleService {
  private roles: string[] = [];

  setRoles(roles: string[] | undefined): void {
    this.roles = roles ?? [];
  }

  getRoles(): string[] {
    return this.roles;
  }

  hasAnyPaymentRole(): boolean {
    return this.roles?.some(role => role.startsWith('payment')) ?? false;
  }

  hasRole(role: string): boolean {
    return this.roles.some(r => r.includes(role));
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.hasRole(role));
  }
}
