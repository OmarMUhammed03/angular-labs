import { Directive, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';

/**
 * Structural directive: opposite of *ngIf
 * Shows content when condition is FALSE
 * Usage: <div *appUnless="isLoading">Content shown when isLoading is false</div>
 */
@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  /**
   * The condition to negate
   */
  condition = input.required<boolean>({ alias: 'appUnless' });

  constructor(
    private templateRef: TemplateRef<void>,
    private viewContainer: ViewContainerRef
  ) {
    // Reactively update view when condition changes
    effect(() => {
      if (!this.condition()) {
        // Create view when condition is FALSE
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        // Destroy view when condition is TRUE
        this.viewContainer.clear();
      }
    });
  }
}
