import { Directive, ElementRef, input, effect } from '@angular/core';

/**
 * Attribute directive: highlights text with background color.
 * Usage:
 *   <p appHighlight appHighlightColor="yellow">Highlighted text</p>
 *   <p appHighlight [appHighlightColor]="myColor">Dynamic</p>
 */
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.padding]': '"2px 4px"',
    '[style.border-radius]': '"4px"',
    '[style.font-weight]': '"500"',
    '[style.display]': '"inline-block"'
  }
})
export class HighlightDirective {
  /**
   * Color input — accepts CSS color name, hex, or rgb
   * Defaults to 'yellow'
   */
  color = input<string>('yellow', { alias: 'appHighlightColor' });

  constructor(private el: ElementRef<HTMLElement>) {
    // Use effect to reactively update background when color changes
    effect(() => {
      this.el.nativeElement.style.backgroundColor = this.color();
    });
  }
}
