import { Directive, ElementRef, inject, signal, afterNextRender, DestroyRef } from '@angular/core';

/** Plays a fade-in-up animation the first time the element scrolls into view. */
@Directive({
  selector: '[appReveal]',
  host: { '[class.reveal-visible]': 'visible()' },
})
export class Reveal {
  protected readonly visible = signal(false);

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.visible.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
