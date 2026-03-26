/**
 * Formatters Module 테스트
 */

import { describe, it, expect } from 'vitest';
import { Formatters } from '../../src/core/formatters.js';

describe('Formatters', () => {

  // ============================================
  // number()
  // ============================================
  describe('number()', () => {
    it('천 단위 구분 포맷', () => {
      const result = Formatters.number(1234567, 'en-US');
      expect(result).toBe('1,234,567');
    });

    it('0은 "0"으로 포맷', () => {
      const result = Formatters.number(0, 'en-US');
      expect(result).toBe('0');
    });

    it('null/undefined/NaN은 빈 문자열 반환', () => {
      expect(Formatters.number(null)).toBe('');
      expect(Formatters.number(undefined)).toBe('');
      expect(Formatters.number(NaN)).toBe('');
    });
  });

  // ============================================
  // currency()
  // ============================================
  describe('currency()', () => {
    it('USD 통화 포맷', () => {
      const result = Formatters.currency(100, 'USD', 'en-US');
      expect(result).toContain('100');
      expect(result).toContain('$');
    });

    it('null/undefined/NaN은 빈 문자열 반환', () => {
      expect(Formatters.currency(null)).toBe('');
      expect(Formatters.currency(undefined)).toBe('');
      expect(Formatters.currency(NaN)).toBe('');
    });
  });

  // ============================================
  // percent()
  // ============================================
  describe('percent()', () => {
    it('정수 퍼센트 포맷', () => {
      expect(Formatters.percent(75)).toBe('75%');
    });

    it('소수점 포맷', () => {
      expect(Formatters.percent(75.5, 1)).toBe('75.5%');
    });

    it('비율(0~1)을 퍼센트로 변환', () => {
      expect(Formatters.percent(0.75, 0, true)).toBe('75%');
    });

    it('null/undefined/NaN은 빈 문자열 반환', () => {
      expect(Formatters.percent(null)).toBe('');
      expect(Formatters.percent(undefined)).toBe('');
      expect(Formatters.percent(NaN)).toBe('');
    });
  });

  // ============================================
  // bytes()
  // ============================================
  describe('bytes()', () => {
    it('0 바이트', () => {
      expect(Formatters.bytes(0)).toBe('0 Bytes');
    });

    it('킬로바이트 변환', () => {
      expect(Formatters.bytes(1024)).toBe('1 KB');
    });

    it('메가바이트 변환', () => {
      expect(Formatters.bytes(1024 * 1024)).toBe('1 MB');
    });

    it('소수점 자리수 조절', () => {
      expect(Formatters.bytes(1536, 1)).toBe('1.5 KB');
    });

    it('null/NaN은 빈 문자열 반환', () => {
      expect(Formatters.bytes(null)).toBe('');
      expect(Formatters.bytes(NaN)).toBe('');
    });
  });

  // ============================================
  // truncate()
  // ============================================
  describe('truncate()', () => {
    it('길이 초과 시 말줄임표 추가', () => {
      expect(Formatters.truncate('Hello World', 8)).toBe('Hello...');
    });

    it('길이 이하면 원본 반환', () => {
      expect(Formatters.truncate('Hi', 10)).toBe('Hi');
    });

    it('커스텀 접미사', () => {
      expect(Formatters.truncate('Hello World', 7, '…')).toBe('Hello …');
    });

    it('null/비문자열은 빈 문자열 반환', () => {
      expect(Formatters.truncate(null, 5)).toBe('');
      expect(Formatters.truncate(123, 5)).toBe('');
    });
  });

  // ============================================
  // phone()
  // ============================================
  describe('phone()', () => {
    it('휴대폰 번호 포맷 (010)', () => {
      expect(Formatters.phone('01012345678')).toBe('010-1234-5678');
    });

    it('서울 번호 포맷 (02, 10자리)', () => {
      expect(Formatters.phone('0212345678')).toBe('02-1234-5678');
    });

    it('빈 값은 빈 문자열 반환', () => {
      expect(Formatters.phone('')).toBe('');
      expect(Formatters.phone(null)).toBe('');
    });
  });

  // ============================================
  // date()
  // ============================================
  describe('date()', () => {
    it('Date 객체를 포맷', () => {
      const d = new Date(2025, 0, 15);
      const result = Formatters.date(d);
      expect(result).toContain('2025');
      expect(result).toContain('01');
      expect(result).toContain('15');
    });

    it('ISO 포맷 반환', () => {
      const d = new Date('2025-01-15T12:00:00.000Z');
      const result = Formatters.date(d, 'iso');
      expect(result).toBe('2025-01-15');
    });

    it('빈 값은 빈 문자열 반환', () => {
      expect(Formatters.date(null)).toBe('');
      expect(Formatters.date('')).toBe('');
    });

    it('유효하지 않은 날짜는 빈 문자열 반환', () => {
      expect(Formatters.date('not-a-date')).toBe('');
    });
  });

  // ============================================
  // time()
  // ============================================
  describe('time()', () => {
    it('Date 객체를 시간으로 포맷', () => {
      const d = new Date(2025, 0, 15, 14, 30);
      const result = Formatters.time(d);
      expect(result).toMatch(/\d/);
    });

    it('빈 값은 빈 문자열 반환', () => {
      expect(Formatters.time(null)).toBe('');
    });
  });

  // ============================================
  // datetime()
  // ============================================
  describe('datetime()', () => {
    it('날짜+시간 포맷', () => {
      const d = new Date(2025, 0, 15, 14, 30);
      const result = Formatters.datetime(d);
      expect(result).toContain('2025');
    });

    it('빈 값은 빈 문자열 반환', () => {
      expect(Formatters.datetime(null)).toBe('');
    });
  });

  // ============================================
  // relative()
  // ============================================
  describe('relative()', () => {
    it('1분 전을 상대 시간으로 표시', () => {
      const d = new Date(Date.now() - 65000);
      const result = Formatters.relative(d);
      expect(result).toMatch(/분|second|minute/);
    });

    it('미래 날짜를 상대 시간으로 표시', () => {
      const d = new Date(Date.now() + 90000);
      const result = Formatters.relative(d);
      expect(result.length).toBeGreaterThan(0);
    });

    it('빈 값은 빈 문자열 반환', () => {
      expect(Formatters.relative(null)).toBe('');
    });
  });

  describe('maskEmail()', () => {
    it('이메일을 마스킹해야 함', () => {
      expect(Formatters.maskEmail('user@example.com')).toBe('us**@example.com');
    });

    it('@가 없는 값은 그대로 반환해야 함', () => {
      expect(Formatters.maskEmail('invalid')).toBe('invalid');
    });

    it('빈 값은 그대로 반환해야 함', () => {
      expect(Formatters.maskEmail('')).toBe('');
      expect(Formatters.maskEmail(null)).toBe(null);
    });

    it('짧은 로컬 파트도 마스킹해야 함', () => {
      expect(Formatters.maskEmail('a@test.com')).toMatch(/^a.*@test\.com$/);
    });
  });

  describe('maskName()', () => {
    it('한글 3자 이름을 마스킹해야 함', () => {
      expect(Formatters.maskName('홍길동')).toBe('홍*동');
    });

    it('한글 2자 이름을 마스킹해야 함', () => {
      expect(Formatters.maskName('홍길')).toBe('홍*');
    });

    it('한글 4자 이름을 마스킹해야 함', () => {
      expect(Formatters.maskName('남궁민수')).toBe('남**수');
    });

    it('영문 이름을 마스킹해야 함', () => {
      const result = Formatters.maskName('John Doe');
      expect(result).toBe('J*** D**');
    });

    it('빈 값은 빈 문자열 반환해야 함', () => {
      expect(Formatters.maskName('')).toBe('');
      expect(Formatters.maskName(null)).toBe('');
    });

    it('한 글자 영문은 그대로 반환해야 함', () => {
      expect(Formatters.maskName('A B')).toBe('A B');
    });
  });
});
