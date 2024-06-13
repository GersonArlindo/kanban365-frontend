import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {

  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    const maskedValue = this.applyMask(value);
    input.value = maskedValue;
  }

  applyMask(value: string): string {
    if (!value) return '';

    let formattedValue = '';
    if (value.length > 0) {
      formattedValue += `(${value.substring(0, 3)}`;
    }
    if (value.length > 3) {
      formattedValue += `) ${value.substring(3, 6)}`;
    }
    if (value.length > 6) {
      formattedValue += `-${value.substring(6, 10)}`;
    }
    return formattedValue;
  }

}
