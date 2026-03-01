import { World, setWorldConstructor } from '@cucumber/cucumber';
import { JSDOM } from 'jsdom';

export class UIWorld extends World {
  public dom!: JSDOM;
  public container!: HTMLElement;
  public cleanup?: () => void;

  setupDom(): void {
    this.dom = new JSDOM(
      '<!DOCTYPE html><html><body><div id="root"></div></body></html>',
      { url: 'http://localhost', pretendToBeVisual: true },
    );

    // Set globals for React and testing-library
    const win = this.dom.window;
    (globalThis as Record<string, unknown>).window = win;
    (globalThis as Record<string, unknown>).document = win.document;
    (globalThis as Record<string, unknown>).navigator = win.navigator;
    (globalThis as Record<string, unknown>).HTMLElement = win.HTMLElement;
    (globalThis as Record<string, unknown>).HTMLSelectElement = win.HTMLSelectElement;
    (globalThis as Record<string, unknown>).HTMLInputElement = win.HTMLInputElement;
    (globalThis as Record<string, unknown>).HTMLButtonElement = win.HTMLButtonElement;
    (globalThis as Record<string, unknown>).HTMLAnchorElement = win.HTMLAnchorElement;
    (globalThis as Record<string, unknown>).MutationObserver = win.MutationObserver;
    (globalThis as Record<string, unknown>).getComputedStyle = win.getComputedStyle;
    (globalThis as Record<string, unknown>).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0);
    (globalThis as Record<string, unknown>).cancelAnimationFrame = clearTimeout;
    (globalThis as Record<string, unknown>).SVGElement = win.SVGElement;
    (globalThis as Record<string, unknown>).DocumentFragment = win.DocumentFragment;
    (globalThis as Record<string, unknown>).Element = win.Element;
    (globalThis as Record<string, unknown>).Text = win.Text;

    this.container = win.document.getElementById('root')!;
  }

  teardownDom(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = undefined;
    }
    if (this.dom) {
      this.dom.window.close();
    }
  }
}

setWorldConstructor(UIWorld);
