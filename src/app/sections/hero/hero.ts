import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { HeroBanner } from './hero-banner';

@Component({
  selector: 'app-hero',
  imports: [HeroBanner],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('heroVideo');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const video = this.video().nativeElement;
      video.muted = true;

      // Pause the background video while it is off-screen to save resources
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        },
        { threshold: 0.25, rootMargin: '50px' },
      );
      observer.observe(video);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
