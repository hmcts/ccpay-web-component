declare module 'govuk-frontend' {
  export interface InitAllConfig {
    scope?: Document | Element | null;
    onError?: (error: Error, context: unknown) => void;
    [componentName: string]: unknown;
  }

  export function initAll(config?: Document | Element | InitAllConfig): void;
}
