import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom currency formatting pipe.
 * Formats a number as currency with optional symbol and decimals.
 * Examples:
 *   1234.5 | currencyFormat:'$':2 → '$1,234.50'
 *   1234.5 | currencyFormat:'€':0 → '€1,235'
 *   1234.5 | currencyFormat:'USD' → 'USD 1,234.50'
 */
@Pipe({
  name: 'currencyFormat',
  pure: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, symbol: string = '$', decimals: number = 2): string {
    if (value === null || value === undefined) return '';
    if (typeof value !== 'number' || isNaN(value)) return '';

    // Format with thousands separator and specified decimals
    const formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    // Determine prefix vs suffix based on symbol length
    return symbol.length > 2
      ? `${symbol} ${formatted}`
      : `${symbol}${formatted}`;
  }
}
