import { TestBed } from '@angular/core/testing';
import { UserRoleService } from './user-role.service';

describe('UserRoleService', () => {
  let service: UserRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setRoles and getRoles', () => {
    it('should set and get roles correctly', () => {
      const roles = ['solicitor', 'caseworker'];
      service.setRoles(roles);
      expect(service.getRoles()).toEqual(roles);
    });

    it('should handle undefined roles gracefully in setRoles', () => {
      service.setRoles(undefined);
      expect(service.getRoles()).toEqual([]);
    });
  });

  describe('hasRole', () => {
    beforeEach(() => {
      service.setRoles(['solicitor', 'payments-refund', 'caseworker']);
    });

    it('should return true if role exists', () => {
      expect(service.hasRole('solicitor')).toBeTrue();
      expect(service.hasRole('payments-refund')).toBeTrue();
    });

    it('should return false if role does not exist', () => {
      expect(service.hasRole('superuser')).toBeFalse();
      expect(service.hasRole('payment')).toBeFalse(); // partial match should fail
    });
  });

  describe('hasAnyRole', () => {
    beforeEach(() => {
      service.setRoles(['solicitor', 'caseworker']);
    });

    it('should return true if at least one role matches', () => {
      const result = service.hasAnyRole(['admin', 'solicitor']);
      expect(result).toBeTrue();
    });

    it('should return false if none of the roles match', () => {
      const result = service.hasAnyRole(['admin', 'superuser']);
      expect(result).toBeFalse();
    });

    it('should return false if requiredRoles is empty', () => {
      const result = service.hasAnyRole([]);
      expect(result).toBeFalse();
    });

    it('should return false if roles are unset in the service', () => {
      service.setRoles(undefined);
      const result = service.hasAnyRole(['solicitor']);
      expect(result).toBeFalse();
    });

    it('should return false if roles in the service are empty', () => {
      service.setRoles([]);
      const result = service.hasAnyRole(['solicitor']);
      expect(result).toBeFalse();
    });
  });

  describe('hasAnyPaymentRole', () => {
    it('should return true if any role starts with "payment"', () => {
      service.setRoles(['caseworker', 'payments-refund', 'solicitor']);
      expect(service.hasAnyPaymentRole()).toBeTrue();
    });

    it('should return false if no role starts with "payment"', () => {
      service.setRoles(['caseworker', 'solicitor']);
      expect(service.hasAnyPaymentRole()).toBeFalse();
    });

    it('should return false if roles array is empty', () => {
      service.setRoles([]);
      expect(service.hasAnyPaymentRole()).toBeFalse();
    });

    it('should return false if roles array is undefined', () => {
      service.setRoles(undefined);
      expect(service.hasAnyPaymentRole()).toBeFalse();
    });
  });
});
