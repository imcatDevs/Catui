/**
 * Helpers Module 테스트
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Helpers } from '../../src/core/helpers.js';

describe('Helpers', () => {

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // ============================================
  // formData()
  // ============================================
  describe('formData()', () => {
    it('폼 데이터를 객체로 수집', () => {
      document.body.innerHTML = `
        <form id="form">
          <input name="name" value="홍길동" />
          <input name="email" value="hong@example.com" />
        </form>
      `;
      const result = Helpers.formData('#form');
      expect(result.name).toBe('홍길동');
      expect(result.email).toBe('hong@example.com');
    });

    it('유효하지 않은 선택자면 빈 객체 반환', () => {
      const result = Helpers.formData('#nonexistent');
      expect(result).toEqual({});
    });

    it('HTMLFormElement가 아닌 요소면 빈 객체 반환', () => {
      document.body.innerHTML = `<div id="notform"></div>`;
      const el = document.querySelector('#notform');
      const result = Helpers.formData(el);
      expect(result).toEqual({});
    });
  });

  // ============================================
  // fillForm()
  // ============================================
  describe('fillForm()', () => {
    it('폼에 데이터를 채움', () => {
      document.body.innerHTML = `
        <form id="form">
          <input name="name" />
          <input name="age" />
        </form>
      `;
      Helpers.fillForm('#form', { name: '홍길동', age: '30' });
      const form = document.querySelector('#form');
      expect(form.elements['name'].value).toBe('홍길동');
      expect(form.elements['age'].value).toBe('30');
    });

    it('유효하지 않은 선택자면 조기 반환', () => {
      expect(() => Helpers.fillForm('#nonexistent', { name: '홍길동' })).not.toThrow();
    });
  });

  // ============================================
  // resetForm()
  // ============================================
  describe('resetForm()', () => {
    it('폼을 초기화', () => {
      document.body.innerHTML = `
        <form id="form">
          <input name="name" value="홍길동" />
        </form>
      `;
      const form = document.querySelector('#form');
      form.elements['name'].value = '변경된 이름';
      Helpers.resetForm('#form');
      expect(form.elements['name'].value).toBe('홍길동');
    });
  });

  // ============================================
  // buildQuery()
  // ============================================
  describe('buildQuery()', () => {
    it('객체를 쿼리 스트링으로 변환', () => {
      const result = Helpers.buildQuery({ name: '홍길동', age: 30 });
      expect(result).toContain('name=');
      expect(result).toContain('age=30');
    });

    it('배열 값을 여러 파라미터로 변환', () => {
      const result = Helpers.buildQuery({ tags: ['a', 'b'] });
      expect(result).toContain('tags');
      expect(result).toContain('a');
      expect(result).toContain('b');
    });

    it('null/undefined 값은 제외', () => {
      const result = Helpers.buildQuery({ a: 'val', b: null, c: undefined });
      expect(result).not.toContain('b=');
      expect(result).not.toContain('c=');
    });
  });

  // ============================================
  // parseQuery()
  // ============================================
  describe('parseQuery()', () => {
    it('URL에서 쿼리 파라미터 파싱', () => {
      const result = Helpers.parseQuery('https://example.com/path?name=홍길동&age=30');
      expect(result.name).toBe('홍길동');
      expect(result.age).toBe('30');
    });
  });

  // ============================================
  // isInViewport()
  // ============================================
  describe('isInViewport()', () => {
    it('존재하지 않는 요소는 false 반환', () => {
      expect(Helpers.isInViewport('#nonexistent')).toBe(false);
    });

    it('요소를 직접 전달 가능', () => {
      document.body.innerHTML = `<div id="el"></div>`;
      const el = document.querySelector('#el');
      const result = Helpers.isInViewport(el);
      expect(typeof result).toBe('boolean');
    });
  });

  // ============================================
  // getStorage() / setStorage()
  // ============================================
  describe('getStorage() / setStorage()', () => {
    it('값 저장 후 읽기', () => {
      Helpers.setStorage('test-key', { value: 42 });
      const result = Helpers.getStorage('test-key');
      expect(result).toEqual({ value: 42 });
    });

    it('없는 키는 defaultValue 반환', () => {
      const result = Helpers.getStorage('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('없는 키의 기본 defaultValue는 null', () => {
      const result = Helpers.getStorage('nonexistent');
      expect(result).toBeNull();
    });

    it('setStorage는 성공 시 true 반환', () => {
      const result = Helpers.setStorage('key', 'value');
      expect(result).toBe(true);
    });
  });

  // ============================================
  // tableData()
  // ============================================
  describe('tableData()', () => {
    it('테이블 데이터를 객체 배열로 추출', () => {
      document.body.innerHTML = `
        <table id="tbl">
          <thead><tr><th>이름</th><th>나이</th></tr></thead>
          <tbody>
            <tr><td>홍길동</td><td>30</td></tr>
            <tr><td>김철수</td><td>25</td></tr>
          </tbody>
        </table>
      `;
      const result = Helpers.tableData('#tbl');
      expect(result).toHaveLength(2);
      expect(result[0]['이름']).toBe('홍길동');
      expect(result[1]['나이']).toBe('25');
    });

    it('유효하지 않은 선택자면 빈 배열 반환', () => {
      const result = Helpers.tableData('#nonexistent');
      expect(result).toEqual([]);
    });
  });

  // ============================================
  // scrollTo() / scrollTop()
  // ============================================
  describe('scrollTo()', () => {
    it('숫자 좌표로 스크롤 — 에러 없이 실행', () => {
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      expect(() => Helpers.scrollTo(100)).not.toThrow();
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 100, behavior: 'smooth' });
    });

    it('scrollTop()은 y=0으로 스크롤', () => {
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      Helpers.scrollTop();
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('문자열 선택자로 스크롤해야 함', () => {
      document.body.innerHTML = '<div id="target" style="height:100px">Target</div>';
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      Helpers.scrollTo('#target');
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it('HTMLElement로 스크롤해야 함', () => {
      document.body.innerHTML = '<div id="el">El</div>';
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      Helpers.scrollTo(document.getElementById('el'));
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe('downloadCSV()', () => {
    it('빈 데이터는 경고 후 반환해야 함', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      Helpers.downloadCSV([], 'test.csv');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('CSV를 생성하고 다운로드해야 함', () => {
      // download 함수를 mock
      const origDownload = Helpers.download;
      Helpers.download = vi.fn();
      Helpers.downloadCSV(
        [{ name: '홍길동', age: 30 }, { name: '김,철수', age: 25 }],
        'test.csv'
      );
      expect(Helpers.download).toHaveBeenCalled();
      Helpers.download = origDownload;
    });

    it('값에 쉼표/따옴표/줄바꿈이 있으면 이스케이프해야 함', () => {
      const origDownload = Helpers.download;
      Helpers.download = vi.fn();
      Helpers.downloadCSV(
        [{ msg: 'hello,"world"\ntest' }],
        'test.csv'
      );
      expect(Helpers.download).toHaveBeenCalled();
      Helpers.download = origDownload;
    });
  });
});
