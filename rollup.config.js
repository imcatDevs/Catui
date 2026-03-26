import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const production = !process.env.ROLLUP_WATCH;

// 코어 번들
const coreConfig = {
  input: 'src/core/index.js',
  output: [
    {
      file: 'dist/imcat-ui.js',
      format: 'iife',
      name: 'IMCAT',
      sourcemap: !production
    },
    {
      file: 'dist/imcat-ui.min.js',
      format: 'iife',
      name: 'IMCAT',
      plugins: [terser()],
      sourcemap: production
    },
    {
      file: 'dist/imcat-ui.esm.js',
      format: 'esm',
      sourcemap: !production
    }
  ],
  plugins: [
    replace({
      '__IMCAT_VERSION__': pkg.version,
      preventAssignment: true
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            chrome: '90',
            firefox: '88',
            safari: '14',
            edge: '90'
          },
          modules: false
        }]
      ]
    }),
    // 개발(watch) 모드에서만 SCSS 컴파일. production 빌드는 npm run build:css 가 담당
    !production && scss({
      output: 'dist/imcat-ui.css',
      outputStyle: 'expanded',
      sourceMap: true
    })
  ].filter(Boolean)
};

// 코어 모듈 external 설정 (확장 모듈에서 코어 코드 중복 번들링 방지)
const coreExternals = [
  '../core/dom.js',
  '../core/event.js',
  '../core/utils.js',
  '../core/security.js',
  '../core/animation.js',
  '../core/state.js',
  '../core/config.js',
  '../core/template.js',
  '../core/api.js',
  '../core/url.js',
  '../core/storage.js',
  '../core/helpers.js',
  '../core/formatters.js',
  '../core/form.js',
  '../core/loading.js',
  // 하위 모듈(data-viz/, navigation/)에서 사용하는 ../../core 경로
  '../../core/dom.js',
  '../../core/event.js',
  '../../core/utils.js',
  '../../core/security.js',
  '../../core/animation.js',
  '../../core/state.js',
  '../../core/config.js',
  '../../core/template.js',
  '../../core/api.js',
  '../../core/url.js',
  '../../core/storage.js',
  '../../core/helpers.js',
  '../../core/formatters.js',
  '../../core/form.js',
  '../../core/loading.js'
];

// 코어 개별 ESM 파일 빌드 (모듈의 ../core/*.js import 해소용)
const coreFileNames = ['dom', 'event', 'security', 'animation', 'utils', 'config'];

function createCoreFileConfig(coreName) {
  return {
    input: `src/core/${coreName}.js`,
    external: (id) => {
      // 코어 간 상호 참조는 external 유지 (예: dom → security)
      if (id.startsWith('./') && id.endsWith('.js')) {
        const name = id.replace('./', '').replace('.js', '');
        return coreFileNames.includes(name);
      }
      return false;
    },
    output: {
      file: `dist/core/${coreName}.js`,
      format: 'esm',
      sourcemap: !production
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      production && terser()
    ].filter(Boolean)
  };
}

const coreFileConfigs = coreFileNames.map(createCoreFileConfig);

// 모듈 번들 함수 (플랫 구조: src/modules/모듈명.js)
function createModuleConfig(moduleName) {
  return {
    input: `src/modules/${moduleName}.js`,
    external: coreExternals,
    output: {
      file: `dist/modules/${moduleName}.js`,
      format: 'esm',
      sourcemap: !production
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      production && terser()
    ].filter(Boolean)
  };
}

// 하위 모듈 번들 함수 (중첩 구조: src/modules/부모/자식.js → dist/modules/부모/자식.js)
function createSubModuleConfig(parentName, subName) {
  return {
    input: `src/modules/${parentName}/${subName}.js`,
    external: coreExternals,
    output: {
      file: `dist/modules/${parentName}/${subName}.js`,
      format: 'esm',
      sourcemap: !production
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      production && terser()
    ].filter(Boolean)
  };
}

// 각 모듈별 개별 config 생성
const moduleConfigs = [
  'theme', 'overlays', 'dropdown', 'navigation', 'pickers', 'selectors', 
  'forms', 'feedback', 'tooltips', 'carousel', 'data-viz',
  'stepper', 'scroll', 'live-status', 'advanced-ui', 'text-editors', 
  'media-viewer', 'social', 'imagelist', 'security-input', 'gantt', 'pagination'
].map(createModuleConfig);

// 하위 모듈 개별 빌드 (트리쉐이킹 가능한 개별 파일)
const subModuleConfigs = [
  // data-viz 하위 모듈
  ...['datatable', 'chart', 'masonry', 'kanban', 'calendar'].map(s => createSubModuleConfig('data-viz', s)),
  // navigation 하위 모듈
  ...['tabs', 'accordion', 'collapse', 'megamenu', 'treeview', 'sidebar'].map(s => createSubModuleConfig('navigation', s))
];

// 코어 + 모듈 + 하위 모듈 빌드
export default [coreConfig, ...coreFileConfigs, ...moduleConfigs, ...subModuleConfigs];
