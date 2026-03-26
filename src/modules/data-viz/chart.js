/**
 * Chart 컴포넌트
 * @module modules/data-viz/chart
 * @description bar, horizontalBar, line, area, pie, doughnut 지원. 툴팁, 그리드, 레전드 포함.
 */

import { Security } from '../../core/security.js';

class Chart {
  static defaults() {
    return {
      type: 'bar',
      data: { labels: [], datasets: [] },
      colors: ['#667eea', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'],
      height: 300,
      showLegend: true,
      showValues: false,
      showGrid: true,
      showTooltip: true,
      gridLines: 5,
      animate: true,
      barRadius: 4
    };
  }

  constructor(selector, options = {}) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.container) return;

    this.options = { ...Chart.defaults(), ...options };
    this._tooltipEl = null;
    this._init();
  }

  _init() {
    this.container.classList.add('chart-wrapper');
    this._render();
    this._bindTooltip();
  }

  _render() {
    const { type, data, showLegend } = this.options;
    this.container.innerHTML = '';

    if (type === 'bar' || type === 'horizontalBar') this._renderBar();
    else if (type === 'line' || type === 'area') this._renderLine();
    else if (type === 'pie' || type === 'doughnut') this._renderPie();

    if (showLegend && data.datasets.length > 0) this._renderLegend();
  }

  _renderBar() {
    const { type, data, colors, height, showValues, showGrid, gridLines, animate, barRadius } = this.options;
    const { labels, datasets } = data;
    const isHorizontal = type === 'horizontalBar';
    const allValues = datasets.flatMap(d => d.data);
    const maxValue = Math.max(...allValues, 0);
    const chartHeight = height - 40;

    let gridHtml = '';
    if (showGrid) {
      for (let i = 0; i <= gridLines; i++) {
        const val = Math.round((maxValue / gridLines) * (gridLines - i));
        const pos = (i / gridLines) * 100;
        gridHtml += isHorizontal
          ? `<div class="chart__grid-line chart__grid-line--vertical" style="left: ${100 - pos}%;">
              <span class="chart__grid-value">${val}</span>
            </div>`
          : `<div class="chart__grid-line" style="top: ${pos}%;">
              <span class="chart__grid-value">${val}</span>
            </div>`;
      }
    }

    let barsHtml = '';
    const gap = 8;
    const groupCount = labels.length;
    const dsCount = datasets.length;

    if (isHorizontal) {
      labels.forEach((label, i) => {
        datasets.forEach((dataset, j) => {
          const value = dataset.data[i] || 0;
          const barWidth = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const color = dataset.color || colors[j % colors.length];
          const top = i * (dsCount * 24 + gap) + j * 24;
          barsHtml += `
            <div class="chart__hbar ${animate ? 'animate' : ''}"
                 style="top: ${top}px; width: ${barWidth}%; background: ${Security.sanitizeCSS(color)}; border-radius: 0 ${barRadius}px ${barRadius}px 0;"
                 data-value="${value}" data-label="${Security.escape(label)}" data-dataset="${Security.escape(dataset.label || '')}">
              ${showValues ? `<span class="chart__hbar-value">${value}</span>` : ''}
            </div>`;
        });
      });
      const totalH = groupCount * (dsCount * 24 + gap);
      this.container.innerHTML = `
        <div class="chart chart--horizontal-bar" style="height: ${Math.max(height, totalH + 40)}px;">
          <div class="chart__y-labels">
            ${labels.map((l, i) => `<span class="chart__y-label" style="top: ${i * (dsCount * 24 + gap) + (dsCount * 12)}px;">${Security.escape(l)}</span>`).join('')}
          </div>
          <div class="chart__area chart__area--horizontal" style="height: ${totalH}px;">
            ${gridHtml}${barsHtml}
          </div>
        </div>`;
    } else {
      const slotWidth = 100 / groupCount;
      const barW = Math.min(slotWidth / (dsCount + 1), 12);

      labels.forEach((label, i) => {
        datasets.forEach((dataset, j) => {
          const value = dataset.data[i] || 0;
          const barHeight = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
          const color = dataset.color || colors[j % colors.length];
          const cx = slotWidth * i + slotWidth / 2;
          const offset = (j - (dsCount - 1) / 2) * (barW + 2);
          barsHtml += `
            <div class="chart__bar ${animate ? 'animate' : ''}"
                 style="left: calc(${cx}% + ${offset}px - ${barW / 2}px); width: ${barW}px; height: ${barHeight}px; background: ${Security.sanitizeCSS(color)}; border-radius: ${barRadius}px ${barRadius}px 0 0;"
                 data-value="${value}" data-label="${Security.escape(label)}" data-dataset="${Security.escape(dataset.label || '')}">
              ${showValues ? `<span class="chart__bar-value">${value}</span>` : ''}
            </div>`;
        });
      });

      const labelsHtml = labels.map((label, i) =>
        `<span class="chart__label" style="left: ${slotWidth * i + slotWidth / 2}%;">${Security.escape(label)}</span>`
      ).join('');

      this.container.innerHTML = `
        <div class="chart chart--bar" style="height: ${height}px;">
          <div class="chart__area" style="height: ${chartHeight}px;">
            ${gridHtml}${barsHtml}
          </div>
          <div class="chart__labels">${labelsHtml}</div>
        </div>`;
    }
  }

  _renderLine() {
    const { type, data, colors, height, showGrid, gridLines, animate } = this.options;
    const { labels, datasets } = data;
    const isArea = type === 'area';
    const allValues = datasets.flatMap(d => d.data);
    const maxValue = Math.max(...allValues, 0);
    const chartHeight = height - 40;

    let gridHtml = '';
    if (showGrid) {
      for (let i = 0; i <= gridLines; i++) {
        const val = Math.round((maxValue / gridLines) * (gridLines - i));
        const pos = (i / gridLines) * 100;
        gridHtml += `<div class="chart__grid-line" style="top: ${pos}%;"><span class="chart__grid-value">${val}</span></div>`;
      }
    }

    let svgContent = '';
    datasets.forEach((dataset, j) => {
      const color = dataset.color || colors[j % colors.length];
      const pts = dataset.data.map((value, i) => {
        const x = labels.length > 1 ? (i / (labels.length - 1)) * 100 : 50;
        const y = maxValue > 0 ? chartHeight - (value / maxValue) * chartHeight : chartHeight;
        return { x, y };
      });
      const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');

      if (isArea) {
        const areaPath = `${pts.map(p => `${p.x},${p.y}`).join(' ')} ${pts[pts.length - 1].x},${chartHeight} ${pts[0].x},${chartHeight}`;
        svgContent += `<polygon class="chart__area-fill ${animate ? 'animate' : ''}" points="${areaPath}" fill="${color}" opacity="0.15"/>`;
      }
      svgContent += `<polyline class="chart__line ${animate ? 'animate' : ''}" points="${pointsStr}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
    });

    let pointsHtml = '';
    datasets.forEach((dataset, j) => {
      const color = dataset.color || colors[j % colors.length];
      dataset.data.forEach((value, i) => {
        const x = labels.length > 1 ? (i / (labels.length - 1)) * 100 : 50;
        const y = maxValue > 0 ? chartHeight - (value / maxValue) * chartHeight : chartHeight;
        pointsHtml += `<div class="chart__point" style="left: ${x}%; top: ${y}px; background: ${Security.sanitizeCSS(color)};" data-value="${value}" data-label="${Security.escape(labels[i])}" data-dataset="${Security.escape(dataset.label || '')}"></div>`;
      });
    });

    const labelsHtml = labels.map((label, i) => {
      const x = labels.length > 1 ? (i / (labels.length - 1)) * 100 : 50;
      return `<span class="chart__label" style="left: ${x}%;">${Security.escape(label)}</span>`;
    }).join('');

    this.container.innerHTML = `
      <div class="chart chart--${type}" style="height: ${height}px;">
        <div class="chart__area" style="height: ${chartHeight}px;">
          ${gridHtml}
          <svg class="chart__line-svg" viewBox="0 0 100 ${chartHeight}" preserveAspectRatio="none">${svgContent}</svg>
          ${pointsHtml}
        </div>
        <div class="chart__labels">${labelsHtml}</div>
      </div>`;
  }

  _renderPie() {
    const { type, data, colors, height, showValues } = this.options;
    const { labels, datasets } = data;
    const values = datasets[0]?.data || [];
    const total = values.reduce((a, b) => a + b, 0);

    let currentAngle = 0;
    const segments = values.map((value, i) => {
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const angle = total > 0 ? (value / total) * 360 : 0;
      const startAngle = currentAngle;
      currentAngle += angle;
      return { value, percentage, startAngle, angle, color: colors[i % colors.length], label: labels[i] };
    });

    const size = height - 20;
    const center = size / 2;
    const radius = center - 10;
    const innerRadius = type === 'doughnut' ? radius * 0.6 : 0;

    const pathsHtml = segments.map(seg => {
      if (seg.angle === 0) return '';
      const startRad = (seg.startAngle - 90) * Math.PI / 180;
      const endRad = (seg.startAngle + seg.angle - 90) * Math.PI / 180;
      const largeArc = seg.angle > 180 ? 1 : 0;
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      let d;
      if (innerRadius > 0) {
        const ix1 = center + innerRadius * Math.cos(startRad);
        const iy1 = center + innerRadius * Math.sin(startRad);
        const ix2 = center + innerRadius * Math.cos(endRad);
        const iy2 = center + innerRadius * Math.sin(endRad);
        d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
      } else {
        d = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }
      return `<path class="chart__pie-segment" d="${d}" fill="${seg.color}" data-value="${seg.value}" data-label="${Security.escape(seg.label)}" data-percent="${seg.percentage.toFixed(1)}"/>`;
    }).join('');

    this.container.innerHTML = `
      <div class="chart chart--${type}" style="height: ${height}px;">
        <svg class="chart__pie-svg" viewBox="0 0 ${size} ${size}" style="width: ${size}px; height: ${size}px;">
          ${pathsHtml}
        </svg>
        ${type === 'doughnut' && showValues ? `
          <div class="chart__doughnut-center">
            <div class="chart__doughnut-total">${total}</div>
            <div class="chart__doughnut-label">Total</div>
          </div>
        ` : ''}
      </div>`;
  }

  _renderLegend() {
    const { colors, data } = this.options;
    const { labels, datasets } = data;
    const items = this.options.type === 'pie' || this.options.type === 'doughnut'
      ? labels.map((label, i) => ({ label, color: colors[i % colors.length] }))
      : datasets.map((d, i) => ({ label: d.label || `Dataset ${i + 1}`, color: d.color || colors[i % colors.length] }));

    this.container.insertAdjacentHTML('beforeend', `
      <div class="chart__legend">
        ${items.map(item => `
          <div class="chart__legend-item">
            <span class="chart__legend-color" style="background: ${Security.sanitizeCSS(item.color)};"></span>
            <span class="chart__legend-label">${Security.escape(item.label)}</span>
          </div>
        `).join('')}
      </div>
    `);
  }

  _bindTooltip() {
    if (!this.options.showTooltip) return;

    this._tooltipEl = document.createElement('div');
    this._tooltipEl.className = 'chart__tooltip';
    this._tooltipEl.style.display = 'none';
    document.body.appendChild(this._tooltipEl);

    this._onMouseOver = (e) => {
      const target = e.target.closest('[data-value]');
      if (!target) return;
      const value = target.dataset.value;
      const label = target.dataset.label || '';
      const dataset = target.dataset.dataset || '';
      const percent = target.dataset.percent ? ` (${target.dataset.percent}%)` : '';
      this._tooltipEl.innerHTML = `${label ? `<strong>${Security.escape(label)}</strong><br>` : ''}${dataset ? `${Security.escape(dataset)}: ` : ''}${Security.escape(value)}${percent}`;
      this._tooltipEl.style.display = 'block';
    };

    this._onMouseMove = (e) => {
      if (this._tooltipEl.style.display === 'block') {
        this._tooltipEl.style.left = `${e.pageX + 12}px`;
        this._tooltipEl.style.top = `${e.pageY - 8}px`;
      }
    };

    this._onMouseOut = (e) => {
      if (!e.target.closest('[data-value]')) {
        this._tooltipEl.style.display = 'none';
      }
    };

    this.container.addEventListener('mouseover', this._onMouseOver);
    this.container.addEventListener('mousemove', this._onMouseMove);
    this.container.addEventListener('mouseout', this._onMouseOut);
  }

  update(data) {
    this.options.data = data;
    this._render();
  }

  destroy() {
    if (this._tooltipEl) { this._tooltipEl.remove(); this._tooltipEl = null; }
    if (this._onMouseOver) this.container.removeEventListener('mouseover', this._onMouseOver);
    if (this._onMouseMove) this.container.removeEventListener('mousemove', this._onMouseMove);
    if (this._onMouseOut) this.container.removeEventListener('mouseout', this._onMouseOut);
    this.container.innerHTML = '';
    this.container.classList.remove('chart-wrapper');
  }
}

export { Chart };
export default Chart;
