import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroBanner } from './hero-banner';

describe('HeroBanner', () => {
  let fixture: ComponentFixture<HeroBanner>;
  const banner = () => (fixture.nativeElement as HTMLElement).querySelector('.banner')!;

  const render = async () => {
    fixture = TestBed.createComponent(HeroBanner);
    await fixture.whenStable();
  };

  beforeEach(() => localStorage.clear());

  it('collapses via the close button and remembers the choice', async () => {
    await render();
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.btn-close')!.click();
    await fixture.whenStable();

    expect(banner().classList.contains('collapsed')).toBe(true);
    expect(localStorage.getItem('bannerCollapsed')).toBe('true');
  });

  it('starts collapsed when previously collapsed, and Escape expands it', async () => {
    localStorage.setItem('bannerCollapsed', 'true');
    await render();
    expect(banner().classList.contains('collapsed')).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(banner().classList.contains('collapsed')).toBe(false);
    expect(localStorage.getItem('bannerCollapsed')).toBe('false');
  });
});
