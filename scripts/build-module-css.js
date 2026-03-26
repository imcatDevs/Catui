/**
 * 모듈별 개별 CSS 빌드 스크립트
 * 각 모듈 SCSS를 dist/modules/{모듈명}.css로 컴파일합니다.
 */

import { execSync } from 'child_process';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const MODULES_DIR = join(process.cwd(), 'src', 'styles', 'modules');
const OUTPUT_DIR = join(process.cwd(), 'dist', 'modules');

// dist/modules 폴더 확인
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// _*.scss 파일 목록
const moduleFiles = readdirSync(MODULES_DIR)
  .filter(f => f.startsWith('_') && f.endsWith('.scss'));

console.log(`📦 모듈 CSS 빌드 시작 (${moduleFiles.length}개)`);

let successCount = 0;
let errorCount = 0;

for (const file of moduleFiles) {
  const moduleName = basename(file, '.scss').replace(/^_/, '');
  const inputPath = join(MODULES_DIR, file);
  const outputPath = join(OUTPUT_DIR, `${moduleName}.css`);

  try {
    execSync(
      `sass ${inputPath} ${outputPath} --style compressed --no-source-map --load-path=src/styles`,
      { stdio: 'pipe' }
    );
    console.log(`  ✅ ${moduleName}.css`);
    successCount++;
  } catch (err) {
    console.error(`  ❌ ${moduleName}.css - ${err.message}`);
    errorCount++;
  }
}

console.log(`\n📦 모듈 CSS 빌드 완료: ${successCount}개 성공, ${errorCount}개 실패`);

if (errorCount > 0) {
  process.exit(1);
}
