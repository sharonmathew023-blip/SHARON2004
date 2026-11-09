const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const html = readFileSync(join(__dirname, '../index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, 'Run the actual inline initialization script');
const source = scripts[0][1];

function boot({ values = new Map(), reducedMotion = false, failRead, failWrite, unavailable = false } = {}) {
  const elements = new Map();
  for (const id of ['year', 'theme-toggle', 'loader', 'loader-percent', 'loader-progress']) {
    elements.set(id, {
      attributes: {},
      listeners: {},
      style: {},
      classList: { add(name) { this[name] = true; } },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, callback) { this.listeners[name] = callback; },
    });
  }
  const root = { dataset: {} };
  const meta = {};
  const events = {};
  const frames = [];
  const timers = [];
  const writes = [];
  const storage = {
    getItem(key) {
      if (key === failRead) throw new Error('Storage read denied');
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (key === failWrite) throw new Error('Storage write denied');
      writes.push([key, value]);
      values.set(key, value);
    },
  };
  const context = {
    document: {
      documentElement: root,
      getElementById: id => elements.get(id),
      querySelector(selector) {
        assert.equal(selector, 'meta[name="theme-color"]');
        return meta;
      },
      querySelectorAll: () => [],
    },
    get localStorage() {
      if (unavailable) throw new Error('Storage unavailable');
      return storage;
    },
    window: {
      matchMedia(query) {
        assert.equal(query, '(prefers-reduced-motion: reduce)');
        return { matches: reducedMotion };
      },
      addEventListener(name, callback, options) { events[name] = { callback, options }; },
    },
    requestAnimationFrame: callback => frames.push(callback),
    setTimeout: (callback, delay) => timers.push({ callback, delay }),
    IntersectionObserver: class { observe() {} },
  };
  runInNewContext(source, context, { filename: 'index.html', timeout: 1000 });
  return { elements, root, meta, events, frames, timers, values, writes,
    click: () => elements.get('theme-toggle').listeners.click() };
}

function assertTheme(page, theme) {
  const light = theme === 'light';
  assert.equal(page.root.dataset.theme ?? 'dark', theme);
  assert.equal(page.elements.get('theme-toggle').attributes['aria-label'],
    light ? 'Switch to dark mode' : 'Switch to light mode');
  assert.equal(page.elements.get('theme-toggle').attributes['aria-pressed'], String(light));
  assert.equal(page.meta.content, light ? '#f7f6f1' : '#0a0a0f');
}

for (const stored of [null, 'dark', 'light', '', 'LIGHT', '<img src=x onerror=alert(1)>']) {
  test(`restores only a recognized light preference: ${JSON.stringify(stored)}`, () => {
    const values = new Map(stored === null ? [] : [['portfolio-theme', stored]]);
    const page = boot({ values });
    assertTheme(page, stored === 'light' ? 'light' : 'dark');
    assert.equal(page.writes.some(([key]) => key === 'portfolio-theme'), false);
  });
}

test('theme clicks persist both directions and survive a new page initialization', () => {
  const page = boot();
  page.click();
  assertTheme(page, 'light');
  assert.equal(page.values.get('portfolio-theme'), 'light');
  assertTheme(boot({ values: page.values }), 'light');
  page.click();
  assertTheme(page, 'dark');
  assert.equal(page.values.get('portfolio-theme'), 'dark');
  assertTheme(boot({ values: page.values }), 'dark');
  assert.equal(page.values.get('portfolio-loader-seen'), '1');
});

test('a failed theme read falls back to dark without disabling theme clicks', () => {
  const page = boot({ failRead: 'portfolio-theme' });
  assertTheme(page, 'dark');
  page.click();
  assertTheme(page, 'light');
  assert.equal(page.values.get('portfolio-theme'), 'light');
});

test('a failed theme write still updates the visible and accessible theme', () => {
  const page = boot({ values: new Map([['portfolio-theme', 'light']]), failWrite: 'portfolio-theme' });
  page.click();
  assertTheme(page, 'dark');
  assert.equal(page.values.get('portfolio-theme'), 'light');
  page.click();
  assertTheme(page, 'light');
});

test('unavailable localStorage hides the loader and leaves theme controls usable', () => {
  const page = boot({ unavailable: true });
  assertTheme(page, 'dark');
  assert.equal(page.elements.get('loader').classList.done, true);
  assert.equal(page.events.load, undefined);
  page.click();
  assertTheme(page, 'light');
  page.click();
  assertTheme(page, 'dark');
});

test('first visit records the marker, completes the loader, and skips it on return', () => {
  const page = boot();
  assert.deepEqual(page.writes, [['portfolio-loader-seen', '1']]);
  assert.equal(page.elements.get('loader').classList.done, undefined);
  assert.equal(page.frames.length, 0);
  assert.equal(page.events.load.options.once, true);
  page.events.load.callback();
  for (const [time, progress] of [[100, 0], [625, 50], [2200, 100]]) {
    assert.equal(page.frames.length, 1);
    page.frames.shift()(time);
    assert.equal(page.elements.get('loader-percent').innerHTML, `${progress}<span>%</span>`);
    assert.equal(page.elements.get('loader-progress').style.width, `${progress}%`);
  }
  assert.equal(page.frames.length, 0);
  assert.equal(page.timers.length, 1);
  assert.equal(page.timers[0].delay, 160);
  assert.equal(page.elements.get('loader').classList.done, undefined);
  page.timers[0].callback();
  assert.equal(page.elements.get('loader').classList.done, true);

  const returning = boot({ values: page.values });
  assert.equal(returning.elements.get('loader').classList.done, true);
  assert.equal(returning.events.load, undefined);
  assert.deepEqual(returning.writes, []);
});

for (const failure of ['failRead', 'failWrite']) {
  test(`loader marker ${failure} does not trap the user behind the loader`, () => {
    const page = boot({ [failure]: 'portfolio-loader-seen' });
    assert.equal(page.elements.get('loader').classList.done, true);
    assert.equal(page.events.load, undefined);
    assert.equal(page.frames.length, 0);
    page.click();
    assertTheme(page, 'light');
  });
}

test('reduced motion skips animation while retaining the first-visit marker', () => {
  const page = boot({ reducedMotion: true });
  assert.equal(page.values.get('portfolio-loader-seen'), '1');
  assert.equal(page.elements.get('loader').classList.done, true);
  assert.equal(page.events.load, undefined);
  assert.equal(page.frames.length, 0);
  assert.equal(page.timers.length, 0);
});
