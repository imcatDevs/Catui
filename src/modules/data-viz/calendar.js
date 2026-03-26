/**
 * Calendar 컴포넌트
 * @module modules/data-viz/calendar
 * @description 월/주간 뷰, today 버튼, 이벤트 카테고리, 이벤트 드래그 이동 지원
 */

import { Security } from '../../core/security.js';

class Calendar {
  /** 이벤트 카테고리 프리셋 */
  static CATEGORIES = {
    primary: '#667eea',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4'
  };

  static defaults() {
    return {
      events: [],
      categories: [],
      defaultDate: new Date(),
      view: 'month',
      weekStart: 0,
      showToday: true,
      maxEventsPerCell: 2,
      onDateClick: null,
      onEventClick: null,
      onMonthChange: null,
      onEventAdd: null
    };
  }

  constructor(selector, options = {}) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this.container) return;

    this.options = { ...Calendar.defaults(), ...options };
    this.currentDate = new Date(this.options.defaultDate);
    this.view = this.options.view;
    this._init();
  }

  _init() {
    this.container.classList.add('calendar');
    this._render();
    this._bindEvents();
  }

  _render() {
    if (this.view === 'week') this._renderWeek();
    else this._renderMonth();
  }

  _renderMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    const cells = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      cells.push({ day: prevMonthLastDay - i, isOtherMonth: true, date: new Date(year, month - 1, prevMonthLastDay - i) });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      cells.push({ day: i, isOtherMonth: false, date: new Date(year, month, i) });
    }
    const remaining = Math.ceil(cells.length / 7) * 7 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, isOtherMonth: true, date: new Date(year, month + 1, i) });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxEvents = this.options.maxEventsPerCell;

    this.container.innerHTML = `
      <div class="calendar__header">
        <div class="calendar__nav">
          <button class="calendar__nav-btn" data-action="prev"><i class="material-icons-outlined">chevron_left</i></button>
          <button class="calendar__nav-btn" data-action="next"><i class="material-icons-outlined">chevron_right</i></button>
          ${this.options.showToday ? '<button class="calendar__today-btn" data-action="today">오늘</button>' : ''}
        </div>
        <h3 class="calendar__title">${year}년 ${monthNames[month]}</h3>
        <div class="calendar__view-toggle">
          <button class="calendar__view-btn ${this.view === 'month' ? 'is-active' : ''}" data-view="month">월</button>
          <button class="calendar__view-btn ${this.view === 'week' ? 'is-active' : ''}" data-view="week">주</button>
        </div>
      </div>
      <div class="calendar__weekdays">
        ${dayNames.map((d, i) => `<div class="calendar__weekday ${i === 0 ? 'sunday' : i === 6 ? 'saturday' : ''}">${d}</div>`).join('')}
      </div>
      <div class="calendar__grid">
        ${cells.map(cell => {
    const dateStr = this._formatDate(cell.date);
    const events = this._getEventsForDate(dateStr);
    const isToday = cell.date.getTime() === today.getTime();
    const dow = cell.date.getDay();
    return `
          <div class="calendar__cell ${cell.isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${dow === 0 ? 'sunday' : ''} ${dow === 6 ? 'saturday' : ''}" data-date="${dateStr}">
            <span class="calendar__day">${cell.day}</span>
            ${events.length > 0 ? `
              <div class="calendar__events">
                ${events.slice(0, maxEvents).map(ev => `
                  <div class="calendar__event" style="background: ${Security.sanitizeCSS(this._getEventColor(ev))};" data-event-id="${Security.escape(ev.id)}" title="${Security.escape(ev.title)}">${Security.escape(ev.title)}</div>
                `).join('')}
                ${events.length > maxEvents ? `<div class="calendar__more">+${events.length - maxEvents}개 더</div>` : ''}
              </div>
            ` : ''}
          </div>`;
  }).join('')}
      </div>
    `;
  }

  _renderWeek() {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDates = this._getWeekDates(this.currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startStr = `${weekDates[0].getMonth() + 1}/${weekDates[0].getDate()}`;
    const endStr = `${weekDates[6].getMonth() + 1}/${weekDates[6].getDate()}`;
    const yearStr = weekDates[0].getFullYear();

    this.container.innerHTML = `
      <div class="calendar__header">
        <div class="calendar__nav">
          <button class="calendar__nav-btn" data-action="prev"><i class="material-icons-outlined">chevron_left</i></button>
          <button class="calendar__nav-btn" data-action="next"><i class="material-icons-outlined">chevron_right</i></button>
          ${this.options.showToday ? '<button class="calendar__today-btn" data-action="today">오늘</button>' : ''}
        </div>
        <h3 class="calendar__title">${yearStr}년 ${startStr} ~ ${endStr}</h3>
        <div class="calendar__view-toggle">
          <button class="calendar__view-btn ${this.view === 'month' ? 'is-active' : ''}" data-view="month">월</button>
          <button class="calendar__view-btn ${this.view === 'week' ? 'is-active' : ''}" data-view="week">주</button>
        </div>
      </div>
      <div class="calendar__week-view">
        ${weekDates.map((date, i) => {
    const dateStr = this._formatDate(date);
    const events = this._getEventsForDate(dateStr);
    const isToday = date.getTime() === today.getTime();
    const dow = date.getDay();
    return `
          <div class="calendar__week-day ${isToday ? 'today' : ''} ${dow === 0 ? 'sunday' : ''} ${dow === 6 ? 'saturday' : ''}" data-date="${dateStr}">
            <div class="calendar__week-day-header">
              <span class="calendar__week-day-name">${dayNames[i]}</span>
              <span class="calendar__week-day-num ${isToday ? 'is-today' : ''}">${date.getDate()}</span>
            </div>
            <div class="calendar__week-day-events">
              ${events.map(ev => `
                <div class="calendar__event" style="background: ${Security.sanitizeCSS(this._getEventColor(ev))};" data-event-id="${Security.escape(ev.id)}" title="${Security.escape(ev.title)}">${Security.escape(ev.title)}</div>
              `).join('')}
            </div>
          </div>`;
  }).join('')}
      </div>
    `;
  }

  _getEventsForDate(dateStr) {
    return this.options.events.filter(e => this._formatDate(new Date(e.date)) === dateStr);
  }

  _getEventColor(event) {
    if (event.color) return event.color;
    if (event.category && Calendar.CATEGORIES[event.category]) return Calendar.CATEGORIES[event.category];
    return Calendar.CATEGORIES.primary;
  }

  _getWeekDates(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(d.getFullYear(), d.getMonth(), diff + i));
    }
    return dates;
  }

  _formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  _bindEvents() {
    this._onClick = (e) => {
      const viewBtn = e.target.closest('.calendar__view-btn');
      if (viewBtn) {
        this.view = viewBtn.dataset.view;
        this._render();
        return;
      }

      const navBtn = e.target.closest('[data-action]');
      if (navBtn) {
        const action = navBtn.dataset.action;
        if (action === 'today') {
          this.currentDate = new Date();
        } else if (action === 'prev') {
          if (this.view === 'month') this.currentDate.setMonth(this.currentDate.getMonth() - 1);
          else this.currentDate.setDate(this.currentDate.getDate() - 7);
        } else if (action === 'next') {
          if (this.view === 'month') this.currentDate.setMonth(this.currentDate.getMonth() + 1);
          else this.currentDate.setDate(this.currentDate.getDate() + 7);
        }
        this._render();
        if (this.options.onMonthChange) this.options.onMonthChange(this.currentDate);
        return;
      }

      const eventEl = e.target.closest('.calendar__event');
      if (eventEl && this.options.onEventClick) {
        this.options.onEventClick(eventEl.dataset.eventId);
        return;
      }

      const cell = e.target.closest('[data-date]');
      if (cell && this.options.onDateClick) {
        this.options.onDateClick(cell.dataset.date);
      }
    };

    this.container.addEventListener('click', this._onClick);
  }

  setView(view) {
    this.view = view;
    this._render();
  }

  goToDate(date) {
    this.currentDate = new Date(date);
    this._render();
  }

  goToToday() {
    this.currentDate = new Date();
    this._render();
  }

  addEvent(event) {
    this.options.events.push(event);
    this._render();
  }

  updateEvent(eventId, data) {
    const event = this.options.events.find(e => e.id === eventId);
    if (event) {
      Object.assign(event, data);
      this._render();
    }
  }

  removeEvent(eventId) {
    this.options.events = this.options.events.filter(e => e.id !== eventId);
    this._render();
  }

  getEvents(date) {
    const dateStr = this._formatDate(new Date(date));
    return this._getEventsForDate(dateStr);
  }

  getAllEvents() {
    return [...this.options.events];
  }

  destroy() {
    if (this._onClick) this.container.removeEventListener('click', this._onClick);
    this.container.innerHTML = '';
    this.container.classList.remove('calendar');
    this.container = null;
  }
}

export { Calendar };
export default Calendar;
