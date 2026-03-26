/**
 * CSS 클래스 문서 자동 생성 스크립트
 * SCSS 소스 + JS 모듈에서 모든 CSS 클래스를 추출하여 Markdown 문서를 생성합니다.
 *
 * 사용법: node scripts/generate-css-docs.js
 * 출력: docs/css-reference.md
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const STYLES_DIR = join(ROOT, 'src', 'styles');
const CORE_DIR = join(ROOT, 'src', 'core');
const MODULES_DIR = join(ROOT, 'src', 'modules');
const OUTPUT_FILE = join(ROOT, 'docs', 'css-reference.md');

// ============================================
// SCSS 파일 수집
// ============================================

/**
 * 카테고리별 SCSS 파일 목록
 * abstracts는 변수/함수/믹스인이므로 제외 (클래스 없음, fonts만 포함)
 */
const FILE_CATEGORIES = [
  {
    title: '아이콘 (Material Icons)',
    description: '내장 Material Icons 폰트 클래스 — `imcat-ui.css`에 포함, 별도 CDN 불필요',
    files: ['abstracts/_fonts.scss']
  },
  {
    title: '베이스 (Base)',
    description: '리셋, 타이포그래피, 유틸리티 클래스',
    files: ['base/_reset.scss', 'base/_typography.scss']
  },
  {
    title: '컴포넌트 (Components)',
    description: '코어 UI 컴포넌트 — `imcat-ui.css`에 포함',
    dir: 'components'
  },
  {
    title: '모듈 (Modules)',
    description: '확장 모듈 CSS — `IMCAT.use()` 시 자동 로드 또는 `dist/modules/*.css`',
    dir: 'modules'
  }
];

// ============================================
// SCSS 파서
// ============================================

/**
 * SCSS 파일에서 클래스 정보를 추출
 * @param {string} filePath - SCSS 파일 경로
 * @returns {Object} { fileName, fileComment, sections: [{ title, classes }] }
 */
function parseScssFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = relative(ROOT, filePath).replace(/\\/g, '/');
  const fileName = basename(filePath, '.scss').replace(/^_/, '');

  // 파일 상단 주석에서 설명 추출
  let fileComment = '';
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    if (line.startsWith('//') && !line.startsWith('// ====')) {
      const text = line.replace(/^\/\/\s*/, '').trim();
      if (text && !text.startsWith('@')) {
        fileComment = text;
        break;
      }
    }
  }

  const result = {
    fileName,
    relPath,
    fileComment,
    sections: []
  };

  let currentSection = null;
  let pendingComment = [];
  let selectorStack = []; // 현재 중첩된 셀렉터 스택
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    let classMatch = null;

    // 섹션 헤더 감지: // ====... 다음 줄의 주석
    if (trimmed.match(/^\/\/\s*={10,}/)) {
      // 다음 줄에서 섹션 제목 추출
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && nextLine.startsWith('//') && !nextLine.match(/^\/\/\s*={10,}/)) {
        const sectionTitle = nextLine.replace(/^\/\/\s*/, '').trim();
        // Variables 섹션은 건너뛰기
        if (sectionTitle === 'Variables' || sectionTitle.startsWith('@')) {
          continue;
        }
        currentSection = { title: sectionTitle, classes: [] };
        result.sections.push(currentSection);
        i++; // 다음 줄 건너뛰기
        // 섹션 헤더 다음의 닫는 구분선도 건너뛰기
        if (lines[i + 1]?.trim().match(/^\/\/\s*={10,}/)) {
          i++;
        }
        pendingComment = [];
        continue;
      }
    }

    // 일반 주석 수집 (클래스 설명용)
    if (trimmed.startsWith('//') && !trimmed.match(/^\/\/\s*={5,}/) && braceDepth === 0) {
      const comment = trimmed.replace(/^\/\/\s*/, '').trim();
      if (comment && !comment.startsWith('@use') && !comment.startsWith('@forward')) {
        pendingComment.push(comment);
      }
      continue;
    }

    // 최상위 레벨 클래스 감지 (들여쓰기 없음)
    if (braceDepth === 0) {
      classMatch = trimmed.match(/^\.([a-zA-Z][\w-]*)\s*[{,]/);
      if (classMatch) {
        const className = classMatch[1];
        const description = pendingComment.length > 0
          ? pendingComment.filter(c => !c.startsWith('$') && !c.startsWith('sass:')).join(' ')
          : '';

        if (!currentSection) {
          currentSection = { title: '일반', classes: [] };
          result.sections.push(currentSection);
        }

        const classInfo = {
          name: '.' + className,
          description,
          children: [],
          line: i + 1
        };
        currentSection.classes.push(classInfo);
        selectorStack = [classInfo];
        pendingComment = [];
      }

      // 태그+클래스 복합 셀렉터: "h1, .h1 {"
      const tagClassMatch = trimmed.match(/^[a-z]+[\d]*\s*,\s*\.([a-zA-Z][\w-]*)\s*\{/);
      if (tagClassMatch && !classMatch) {
        const className = tagClassMatch[1];
        const description = pendingComment.length > 0
          ? pendingComment.filter(c => !c.startsWith('$')).join(' ')
          : '';

        if (!currentSection) {
          currentSection = { title: '일반', classes: [] };
          result.sections.push(currentSection);
        }

        const classInfo = {
          name: '.' + className,
          description,
          children: [],
          line: i + 1
        };
        currentSection.classes.push(classInfo);
        selectorStack = [classInfo];
        pendingComment = [];
      }
    }

    // 중첩 클래스 감지 (braceDepth === 1, & 사용)
    if (braceDepth === 1 && selectorStack.length > 0) {
      // BEM modifier: &--name
      const modMatch = trimmed.match(/^&--([a-zA-Z][\w-]*)\s*[{,]/);
      if (modMatch) {
        const parentName = selectorStack[0].name.slice(1); // .btn → btn
        const fullName = `${parentName}--${modMatch[1]}`;
        const desc = pendingComment.length > 0
          ? pendingComment.filter(c => !c.startsWith('$')).join(' ')
          : '';
        selectorStack[0].children.push({
          name: '.' + fullName,
          description: desc,
          type: 'modifier'
        });
        pendingComment = [];
      }

      // BEM element: &__name
      const elemMatch = trimmed.match(/^&__([a-zA-Z][\w-]*)\s*[{,]/);
      if (elemMatch) {
        const parentName = selectorStack[0].name.slice(1);
        const fullName = `${parentName}__${elemMatch[1]}`;
        const desc = pendingComment.length > 0
          ? pendingComment.filter(c => !c.startsWith('$')).join(' ')
          : '';
        selectorStack[0].children.push({
          name: '.' + fullName,
          description: desc,
          type: 'element'
        });
        pendingComment = [];
      }

      // 상태 클래스: &.is-name
      const stateMatch = trimmed.match(/^&\.(is-[a-zA-Z][\w-]*)\s*[{,]/);
      if (stateMatch) {
        const desc = pendingComment.length > 0
          ? pendingComment.filter(c => !c.startsWith('$')).join(' ')
          : '';
        selectorStack[0].children.push({
          name: '.' + stateMatch[1],
          description: desc,
          type: 'state'
        });
        pendingComment = [];
      }
    }

    // 독립적인 클래스 (braceDepth === 1 내부에서 . 시작, & 미사용)
    if (braceDepth >= 1) {
      const nestedClassMatch = trimmed.match(/^\.([\w][\w-]*)\s*[{,]/);
      if (nestedClassMatch && !trimmed.startsWith('&') && selectorStack.length > 0) {
        // 부모 내부에 중첩된 독립 클래스는 건너뛰기 (context selector)
      }
    }

    // 중괄호 추적
    const openBraces = (trimmed.match(/\{/g) || []).length;
    const closeBraces = (trimmed.match(/\}/g) || []).length;
    braceDepth += openBraces - closeBraces;

    if (braceDepth <= 0) {
      braceDepth = 0;
      selectorStack = [];
    }

    // 비 주석 줄이면 pending comment 리셋
    if (!trimmed.startsWith('//') && trimmed !== '' && !trimmed.startsWith('@') && !trimmed.startsWith('$')) {
      if (!classMatch && !trimmed.match(/^&/) && !trimmed.match(/^\./)) {
        pendingComment = [];
      }
    }
  }

  return result;
}

// ============================================
// JS 파일에서 CSS 클래스 추출
// ============================================

/**
 * JS 파일에서 사용되는 CSS 클래스를 추출
 * 패턴: className=, classList.add/remove/toggle/contains, class="..."
 * @param {string} filePath - JS 파일 경로
 * @returns {Object} { fileName, relPath, sections: [{ title, classes }] }
 */
function parseJsFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const relPath = relative(ROOT, filePath).replace(/\\/g, '/');
  const fileName = basename(filePath, '.js');
  const classSet = new Map(); // className -> { contexts, line }

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 패턴 1: className = 'cls1 cls2'
    const classNameAssign = line.match(/\.className\s*=\s*[`'"]([^`'"]+)[`'"]/);
    if (classNameAssign) {
      extractClassNames(classNameAssign[1]).forEach(c => addJsClass(classSet, c, i + 1, 'className'));
    }

    // 패턴 1b: className = `cls ${var}`
    const classNameTemplate = line.match(/\.className\s*=\s*`([^`]+)`/);
    if (classNameTemplate && !classNameAssign) {
      extractClassNames(classNameTemplate[1]).forEach(c => addJsClass(classSet, c, i + 1, 'className'));
    }

    // 패턴 2: classList.add('cls'), classList.add('cls1', 'cls2')
    const classListMethods = [...line.matchAll(/classList\.(?:add|remove|toggle|contains)\(([^)]+)\)/g)];
    for (const m of classListMethods) {
      const args = m[1];
      const strings = [...args.matchAll(/['"]([^'"]+)['"]/g)];
      for (const s of strings) {
        extractClassNames(s[1]).forEach(c => addJsClass(classSet, c, i + 1, 'classList'));
      }
      // 템플릿 리터럴: `tabs--${...}`
      const templates = [...args.matchAll(/`([^`]+)`/g)];
      for (const t of templates) {
        extractClassNames(t[1]).forEach(c => addJsClass(classSet, c, i + 1, 'classList'));
      }
    }

    // 패턴 3: class="cls1 cls2" (innerHTML 템플릿 내부)
    const classAttrs = [...line.matchAll(/class="([^"]+)"/g)];
    for (const m of classAttrs) {
      extractClassNames(m[1]).forEach(c => addJsClass(classSet, c, i + 1, 'HTML'));
    }

    // 패턴 4: class=\\"cls\\" (escaped quotes in template literals)
    const escapedClassAttrs = [...line.matchAll(/class=\\["']([^\\]+)\\["']/g)];
    for (const m of escapedClassAttrs) {
      extractClassNames(m[1]).forEach(c => addJsClass(classSet, c, i + 1, 'HTML'));
    }
  }

  // 결과 정리: BEM 계층별로 그룹화
  const grouped = groupByComponent(classSet);

  return {
    fileName,
    relPath,
    fileComment: '',
    sections: grouped
  };
}

/**
 * CSS 클래스명 추출 (템플릿 변수 제거)
 */
function extractClassNames(str) {
  // 템플릿 변수 ${...} 제거
  const cleaned = str.replace(/\$\{[^}]*\}/g, '').trim();
  // 공백으로 분리하여 개별 클래스명 추출
  return cleaned.split(/\s+/).filter(c => {
    // 유효한 CSS 클래스명: 영문자로 시작, 영숫자/하이픈/언더스코어로 구성
    // trailing dash/underscore 제거 (템플릿 잔여물)
    return c && /^[a-zA-Z][\w-]*[a-zA-Z0-9]$/.test(c) && c.length > 1;
  });
}

function addJsClass(map, className, line, context) {
  if (!map.has(className)) {
    map.set(className, { line, contexts: new Set() });
  }
  map.get(className).contexts.add(context);
}

/**
 * BEM 컴포넌트별 그룹화
 */
function groupByComponent(classMap) {
  const components = new Map(); // 블록명 -> { block, elements, modifiers, states }

  for (const [cls] of classMap) {
    let blockName;
    let type = 'block';

    if (cls.includes('__')) {
      blockName = cls.split('__')[0];
      type = 'element';
    } else if (cls.includes('--')) {
      blockName = cls.split('--')[0];
      type = 'modifier';
    } else if (cls.startsWith('is-') || cls.startsWith('has-')) {
      blockName = '__states__';
      type = 'state';
    } else {
      blockName = cls;
      type = 'block';
    }

    if (!components.has(blockName)) {
      components.set(blockName, { blocks: [], elements: [], modifiers: [], states: [] });
    }

    const group = components.get(blockName);
    const entry = { name: '.' + cls, type };

    if (type === 'block') group.blocks.push(entry);
    else if (type === 'element') group.elements.push(entry);
    else if (type === 'modifier') group.modifiers.push(entry);
    else if (type === 'state') group.states.push(entry);
  }

  // 섹션으로 변환
  const sections = [];
  const sortedKeys = [...components.keys()].sort();

  // 상태 클래스 별도 섹션
  const stateGroup = components.get('__states__');
  if (stateGroup && stateGroup.states.length > 0) {
    sections.push({
      title: '공통 상태 클래스',
      classes: stateGroup.states.map(s => ({
        name: s.name,
        description: '',
        children: [],
        type: 'state'
      }))
    });
  }

  for (const key of sortedKeys) {
    if (key === '__states__') continue;
    const group = components.get(key);
    const all = [...group.blocks, ...group.elements, ...group.modifiers];
    if (all.length === 0) continue;

    const classes = [];
    // 블록 클래스
    for (const b of group.blocks) {
      classes.push({
        name: b.name,
        description: '',
        children: [
          ...group.elements.map(e => ({ name: e.name, description: '', type: 'element' })),
          ...group.modifiers.map(m => ({ name: m.name, description: '', type: 'modifier' }))
        ]
      });
    }

    // 블록 없이 element/modifier만 있는 경우
    if (group.blocks.length === 0) {
      for (const item of all) {
        classes.push({ name: item.name, description: '', children: [] });
      }
    }

    if (classes.length > 0) {
      sections.push({ title: key, classes });
    }
  }

  return sections;
}

// ============================================
// 빌드된 CSS에서 추가 클래스 추출 (검증용)
// ============================================

/**
 * 컴파일된 CSS 파일에서 클래스 목록 추출 (존재하는 경우)
 * @param {string} cssPath
 * @returns {Set<string>}
 */
function extractClassesFromCSS(cssPath) {
  try {
    const css = readFileSync(cssPath, 'utf-8');
    const classes = new Set();
    // .className 패턴 추출 (미디어 쿼리, @keyframes 등 내부도 포함)
    const regex = /\.([a-zA-Z][\w-]*(?:__[\w-]+)?(?:--[\w-]+)?)/g;
    let match;
    while ((match = regex.exec(css)) !== null) {
      classes.add(match[1]);
    }
    return classes;
  } catch {
    return null;
  }
}

// ============================================
// Markdown 생성
// ============================================

/**
 * 파싱 결과를 Markdown 테이블로 변환
 */
function generateMarkdown(categories) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let totalClasses = 0;
  let md = '';

  md += '# CSS 클래스 레퍼런스\n\n';
  md += 'IMCAT UI 프레임워크에 구현된 모든 CSS 클래스 목록입니다.\n\n';
  md += `> 이 문서는 \`node scripts/generate-css-docs.js\`로 자동 생성됩니다.\n`;
  md += `> 마지막 생성: ${dateStr}\n\n`;

  // 목차
  md += '## 목차\n\n';
  for (const cat of categories) {
    md += `- [${cat.title}](#${slugify(cat.title)})\n`;
    for (const file of cat.parsedFiles) {
      if (file.sections.length > 0) {
        const classCount = countClasses(file);
        md += `  - [${file.fileName}](#${slugify(file.fileName)}) (${classCount}개)\n`;
      }
    }
  }
  md += '\n---\n\n';

  // 카테고리별 출력
  for (const cat of categories) {
    md += `## ${cat.title}\n\n`;
    md += `${cat.description}\n\n`;

    for (const file of cat.parsedFiles) {
      if (file.sections.length === 0) continue;

      const classCount = countClasses(file);
      totalClasses += classCount;

      md += `### ${file.fileName}\n\n`;
      if (file.fileComment) {
        md += `${file.fileComment}\n\n`;
      }
      md += `> 소스: \`${file.relPath}\` | 클래스: **${classCount}개**\n\n`;

      for (const section of file.sections) {
        if (section.classes.length === 0) continue;

        md += `#### ${section.title}\n\n`;
        md += '| 클래스 | 유형 | 설명 |\n';
        md += '| --- | --- | --- |\n';

        for (const cls of section.classes) {
          const desc = cls.description || '—';
          md += `| \`${cls.name}\` | 블록 | ${desc} |\n`;

          // 자식 (modifier, element, state)
          for (const child of cls.children) {
            const typeLabel = child.type === 'modifier' ? '변형'
              : child.type === 'element' ? '요소'
              : child.type === 'state' ? '상태'
              : '';
            const childDesc = child.description || '—';
            md += `| \`${child.name}\` | ${typeLabel} | ${childDesc} |\n`;
          }
        }
        md += '\n';
      }
    }
  }

  // 통계
  md += '---\n\n';
  md += '## 통계\n\n';
  md += `| 항목 | 수 |\n`;
  md += `| --- | --- |\n`;
  md += `| **전체 클래스** | ${totalClasses}개 |\n`;

  for (const cat of categories) {
    let catCount = 0;
    for (const file of cat.parsedFiles) {
      catCount += countClasses(file);
    }
    md += `| ${cat.title} | ${catCount}개 |\n`;
  }
  md += '\n';

  // 빌드 CSS 검증
  const cssPath = join(ROOT, 'dist', 'imcat-ui.css');
  const builtClasses = extractClassesFromCSS(cssPath);
  if (builtClasses) {
    md += `> 빌드된 \`dist/imcat-ui.css\`에서 추출된 고유 클래스: **${builtClasses.size}개**\n`;
  }

  return md;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9가-힣-]/g, '')
    .replace(/-+/g, '-');
}

function countClasses(file) {
  let count = 0;
  for (const section of file.sections) {
    for (const cls of section.classes) {
      count += 1 + cls.children.length;
    }
  }
  return count;
}

// ============================================
// 디렉토리에서 SCSS 파일 수집
// ============================================

function getScssFiles(dirPath) {
  const files = [];
  try {
    for (const entry of readdirSync(dirPath)) {
      const fullPath = join(dirPath, entry);
      if (statSync(fullPath).isFile() && entry.endsWith('.scss') && entry.startsWith('_')) {
        files.push(fullPath);
      }
    }
  } catch {
    // 디렉토리가 없으면 무시
  }
  return files.sort();
}

function getJsFiles(dirPath) {
  const files = [];
  try {
    for (const entry of readdirSync(dirPath)) {
      const fullPath = join(dirPath, entry);
      if (statSync(fullPath).isFile() && entry.endsWith('.js')) {
        files.push(fullPath);
      }
    }
  } catch {
    // 디렉토리가 없으면 무시
  }
  return files.sort();
}

// ============================================
// 메인 실행
// ============================================

function main() {
  console.log('📄 CSS 클래스 문서 생성 시작...\n');

  const categories = [];

  for (const catDef of FILE_CATEGORIES) {
    const cat = {
      title: catDef.title,
      description: catDef.description,
      parsedFiles: []
    };

    let filePaths = [];

    if (catDef.files) {
      filePaths = catDef.files.map(f => join(STYLES_DIR, f));
    } else if (catDef.dir) {
      filePaths = getScssFiles(join(STYLES_DIR, catDef.dir));
    }

    for (const fp of filePaths) {
      try {
        const parsed = parseScssFile(fp);
        const classCount = countClasses(parsed);
        if (classCount > 0) {
          cat.parsedFiles.push(parsed);
          console.log(`  ✅ ${parsed.relPath} — ${classCount}개 클래스`);
        } else {
          console.log(`  ⏭️  ${relative(ROOT, fp).replace(/\\/g, '/')} — 클래스 없음`);
        }
      } catch (err) {
        console.error(`  ❌ ${relative(ROOT, fp).replace(/\\/g, '/')}: ${err.message}`);
      }
    }

    categories.push(cat);
  }

  // JS 모듈에서 CSS 클래스 추출
  console.log('\n📜 JS 모듈 CSS 클래스 추출...\n');

  const jsCategories = [
    {
      title: 'JS 코어 모듈 (Core)',
      description: '코어 JS에서 동적으로 생성/사용하는 CSS 클래스',
      dir: CORE_DIR
    },
    {
      title: 'JS 확장 모듈 (Modules)',
      description: '확장 모듈 JS에서 동적으로 생성/사용하는 CSS 클래스',
      dir: MODULES_DIR
    }
  ];

  for (const jsCatDef of jsCategories) {
    const jsCat = {
      title: jsCatDef.title,
      description: jsCatDef.description,
      parsedFiles: []
    };

    const jsFiles = getJsFiles(jsCatDef.dir);
    for (const fp of jsFiles) {
      try {
        const parsed = parseJsFile(fp);
        const classCount = countClasses(parsed);
        if (classCount > 0) {
          jsCat.parsedFiles.push(parsed);
          console.log(`  ✅ ${parsed.relPath} — ${classCount}개 클래스`);
        }
      } catch (err) {
        console.error(`  ❌ ${relative(ROOT, fp).replace(/\\/g, '/')}: ${err.message}`);
      }
    }

    categories.push(jsCat);
  }

  const markdown = generateMarkdown(categories);
  writeFileSync(OUTPUT_FILE, markdown, 'utf-8');

  let totalClasses = 0;
  for (const cat of categories) {
    for (const f of cat.parsedFiles) {
      totalClasses += countClasses(f);
    }
  }

  console.log(`\n✨ 완료! docs/css-reference.md 생성 (총 ${totalClasses}개 클래스)`);
}

main();
