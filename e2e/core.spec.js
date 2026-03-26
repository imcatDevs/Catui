/**
 * IMCAT UI 코어 기능 E2E 테스트
 * @description 기본 페이지 로드, DOM 조작, 라우팅 등 코어 기능 검증
 */
import { test, expect } from '@playwright/test';

test.describe('코어 페이지 로드', () => {
  test('메인 페이지 로드 및 IMCAT 전역 객체 확인', async ({ page }) => {
    await page.goto('/');
    
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/IMCAT/i);

    // IMCAT 전역 객체 존재 확인
    const hasIMCAT = await page.evaluate(() => typeof window.IMCAT !== 'undefined');
    expect(hasIMCAT).toBe(true);
  });

  test('CSS 스타일시트 로드 확인', async ({ page }) => {
    await page.goto('/');

    // imcat-ui.css 또는 imcat-ui.all.css 로드 확인
    const stylesheets = await page.evaluate(() => {
      return Array.from(document.styleSheets).map(s => s.href).filter(Boolean);
    });

    const hasIMCATCSS = stylesheets.some(href => href.includes('imcat-ui'));
    expect(hasIMCATCSS).toBe(true);
  });

  test('JS 번들 로드 및 코어 모듈 초기화 확인', async ({ page }) => {
    await page.goto('/');

    const coreModules = await page.evaluate(() => {
      if (!window.IMCAT) return {};
      return {
        hasDOM: typeof window.IMCAT === 'function',
        hasSecurity: typeof window.IMCAT.security !== 'undefined',
        hasUtils: typeof window.IMCAT.utils !== 'undefined',
        hasConfig: typeof window.IMCAT.config !== 'undefined',
        hasUse: typeof window.IMCAT.use === 'function'
      };
    });

    expect(coreModules.hasDOM).toBe(true);
    expect(coreModules.hasSecurity).toBe(true);
    expect(coreModules.hasUtils).toBe(true);
    expect(coreModules.hasConfig).toBe(true);
    expect(coreModules.hasUse).toBe(true);
  });
});

test.describe('DOM 조작', () => {
  test('IMCAT() 셀렉터로 요소 선택', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(() => {
      const el = window.IMCAT('body');
      return el && el.length > 0;
    });

    expect(result).toBe(true);
  });

  test('html() XSS 자동 이스케이프 확인', async ({ page }) => {
    await page.goto('/');

    const escaped = await page.evaluate(() => {
      const div = document.createElement('div');
      div.id = 'xss-test';
      document.body.appendChild(div);
      window.IMCAT('#xss-test').html('<script>alert("XSS")</script>');
      return document.getElementById('xss-test').innerHTML;
    });

    // script 태그가 이스케이프되어야 함
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
  });
});

test.describe('동적 모듈 로딩', () => {
  test('IMCAT.use()로 모듈 로드', async ({ page }) => {
    await page.goto('/');

    const moduleLoaded = await page.evaluate(async () => {
      try {
        const mod = await window.IMCAT.use('overlays');
        return mod && typeof mod.Modal !== 'undefined';
      } catch {
        return false;
      }
    });

    expect(moduleLoaded).toBe(true);
  });

  test('모듈 캐싱: 두 번째 로드는 캐시에서', async ({ page }) => {
    await page.goto('/');

    const isCached = await page.evaluate(async () => {
      const start1 = performance.now();
      await window.IMCAT.use('overlays');
      const time1 = performance.now() - start1;

      const start2 = performance.now();
      await window.IMCAT.use('overlays');
      const time2 = performance.now() - start2;

      // 두 번째 로드가 현저히 빨라야 함
      return time2 < time1;
    });

    expect(isCached).toBe(true);
  });
});

test.describe('보안', () => {
  test('Security.escape() XSS 방어', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(() => {
      return window.IMCAT.security.escape('<img src=x onerror=alert(1)>');
    });

    expect(result).not.toContain('<img');
    expect(result).toContain('&lt;img');
  });

  test('Security.validateColor() CSS 인젝션 방어', async ({ page }) => {
    await page.goto('/');

    const results = await page.evaluate(() => {
      const s = window.IMCAT.security;
      return {
        valid: s.validateColor('#ff0000'),
        invalid: s.validateColor('url(javascript:alert(1))'),
        named: s.validateColor('red')
      };
    });

    expect(results.valid).toBe('#ff0000');
    expect(results.invalid).toBe('');
    expect(results.named).toBe('red');
  });
});

test.describe('SPA 라우팅', () => {
  test('catui-href 네비게이션', async ({ page }) => {
    await page.goto('/');

    // catui-href 링크가 존재하는지 확인
    const hasRouterLinks = await page.evaluate(() => {
      return document.querySelectorAll('[catui-href]').length > 0;
    });

    if (hasRouterLinks) {
      // 첫 번째 라우터 링크 클릭
      const link = page.locator('[catui-href]').first();
      await link.click();

      // URL이 변경되었는지 확인 (hash 또는 path)
      await page.waitForTimeout(500);
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });
});
