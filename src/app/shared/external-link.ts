import { Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Opens an external link in a named browser window so repeated clicks reuse the same tab.
 * Modified clicks (ctrl/cmd/shift/middle) keep the browser's default behaviour.
 */
@Directive({
  selector: 'a[appExternalLink]',
  host: {
    target: '_blank',
    rel: 'noopener noreferrer',
    '(click)': 'onClick($event)',
  },
})
export class ExternalLink {
  /** Optional window name; defaults to one derived from the URL. */
  readonly appExternalLink = input<string>('');

  private readonly anchor = inject<ElementRef<HTMLAnchorElement>>(ElementRef).nativeElement;

  protected onClick(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const url = this.anchor.href;
    const target = window.open(url, this.appExternalLink() || `ext_${hash(url)}`);
    if (target) {
      try {
        target.opener = null;
      } catch {
        // ignore: window may already be cross-origin
      }
      target.focus();
    }
  }
}

function hash(value: string): string {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
