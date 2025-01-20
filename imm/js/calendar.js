// js/calendar.js

const Calendar = {
    childInfo: null,
    events: [],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.events = [];
        this.loadEvents();
        this.render();
        this.setupEventListeners();
    },

    loadEvents() {
        // Загрузка пользовательских событий из localStorage
        const savedEvents = localStorage.getItem('calendarEvents');
        if (savedEvents) {
            this.events = JSON.parse(savedEvents);
        }

        // Загрузка вакцин
        this.loadVaccineEvents();

        // Загрузка туберкулинодиагностики
        this.loadTuberculinEvents();
    },

    loadVaccineEvents() {
        const vaccines = Vaccines.getVaccines();
        vaccines.forEach(vaccine => {
            const eventDate = this.calculateEventDate(vaccine.scheduledDays);
            if (eventDate) {
                this.events.push({
                    id: `vaccine-${vaccine.id}`,
                    title: vaccine.name,
                    date: eventDate,
                    type: 'vaccine',
                    completed: vaccine.completed
                });
            }
        });
    },

    loadTuberculinEvents() {
        const tuberculinTests = Tuberculin.getTests();
        tuberculinTests.forEach(test => {
            this.events.push({
                id: `test-${test.id}`,
                title: test.type === 'mantu' ? 'Проба Манту' : 'Диаскинтест',
                date: test.date,
                type: 'tuberculin',
                result: test.result
            });
        });
    },

    calculateEventDate(days) {
        if (!this.childInfo || !this.childInfo.birthdate) {
            return null;
        }
        const birthDate = new Date(this.childInfo.birthdate);
        return new Date(birthDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    },

    render() {
        this.container.innerHTML = `
            <div class="calendar-container">
                <div class="calendar-wrapper">
                    <div class="mini-calendar">
                        <div class="calendar-header">
                            <button id="prev-month" class="btn btn-icon"><i class="fas fa-chevron-left"></i></button>
                            <h2 id="current-month-year">${this.getMonthName(this.currentMonth)} ${this.currentYear}</h2>
                            <button id="next-month" class="btn btn-icon"><i class="fas fa-chevron-right"></i></button>
                        </div>
                        <div class="calendar-grid" id="calendar-grid"></div>
                    </div>
                    <div class="calendar-events">
                        <h3>События на ${this.getMonthName(this.currentMonth)}</h3>
                        <div id="events-list"></div>
                        <button id="add-event" class="btn btn-primary">Добавить событие</button>
                    </div>
                </div>
            </div>
        `;
        this.renderCalendarGrid();
        this.renderEvents();
    },

    renderCalendarGrid() {
        const calendarGrid = document.getElementById('calendar-grid');
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();

        let gridHTML = '';

        // Добавляем дни недели
        const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        weekdays.forEach(day => {
            gridHTML += `<div class="calendar-day weekday">${day}</div>`;
        });

        // Добавляем пустые ячейки в начале месяца
        for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
            gridHTML += '<div class="calendar-day empty"></div>';
        }

        // Добавляем дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(Date.UTC(this.currentYear, this.currentMonth, day));
            const dateString = date.toISOString().split('T')[0];
            const events = this.getEventsForDate(dateString);
            const isToday = this.isToday(date);

            gridHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateString}">
                    ${day}
                    ${events.length > 0 ? '<div class="event-indicator"></div>' : ''}
                </div>
            `;
        }

        calendarGrid.innerHTML = gridHTML;
    },

    renderEvents() {
        const eventsContainer = document.getElementById('events-list');
        const events = this.getEventsForMonth(this.currentYear, this.currentMonth);

        if (events.length === 0) {
            eventsContainer.innerHTML = '<p class="no-events">Нет событий на этот месяц</p>';
        } else {
            let eventsHTML = '<ul class="events-list">';
            events.forEach(event => {
                const eventDate = new Date(event.date);
                eventsHTML += `
                    <li class="event-item ${event.type}">
                        <div class="event-date">${eventDate.getUTCDate()} ${this.getMonthName(eventDate.getUTCMonth())}</div>
                        <div class="event-details">
                            <span class="event-title">${event.title}</span>
                            ${event.type === 'vaccine' ? `<span class="event-status">${event.completed ? 'Выполнено' : 'Ожидает'}</span>` : ''}
                            ${event.type === 'tuberculin' ? `<span class="event-result">Результат: ${event.result} мм</span>` : ''}
                        </div>
                        ${event.type === 'custom' ? `<button class="btn-icon btn-delete" data-id="${event.id}"><i class="fas fa-trash"></i></button>` : ''}
                    </li>
                `;
            });
            eventsHTML += '</ul>';
            eventsContainer.innerHTML = eventsHTML;
        }
    },

    getEventsForMonth(year, month) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getUTCFullYear() === year && eventDate.getUTCMonth() === month;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    getEventsForDate(dateString) {
        return this.events.filter(event => event.date === dateString);
    },

    isToday(date) {
        const today = new Date();
        return date.getUTCFullYear() === today.getUTCFullYear() &&
               date.getUTCMonth() === today.getUTCMonth() &&
               date.getUTCDate() === today.getUTCDate();
    },

    getMonthName(month) {
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return monthNames[month];
    },

    setupEventListeners() {
        document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));

        document.getElementById('calendar-grid').addEventListener('click', (e) => {
            const dayElement = e.target.closest('.calendar-day');
            if (dayElement && !dayElement.classList.contains('empty')) {
                const date = dayElement.dataset.date;
                this.showEventsForDay(date);
            }
        });

        document.getElementById('add-event').addEventListener('click', () => this.showAddEventModal());

        document.getElementById('events-list').addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete')) {
                const eventId = e.target.closest('.btn-delete').dataset.id;
                this.deleteEvent(eventId);
            }
        });
    },

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }

        document.getElementById('current-month-year').textContent = `${this.getMonthName(this.currentMonth)} ${this.currentYear}`;
        this.renderCalendarGrid();
        this.renderEvents();
    },

    showEventsForDay(dateString) {
        const events = this.getEventsForDate(dateString);
        let content = `<h3>События на ${Utils.formatDate(new Date(dateString))}</h3>`;

        if (events.length === 0) {
            content += '<p>Нет событий на этот день</p>';
        } else {
            content += '<ul class="events-list">';
            events.forEach(event => {
                content += `
                    <li class="event-item ${event.type}">
                        <span class="event-title">${event.title}</span>
                        ${event.type === 'vaccine' ? `<span class="event-status">${event.completed ? 'Выполнено' : 'Запланировано'}</span>` : ''}
                        ${event.type === 'tuberculin' ? `<span class="event-result">Результат: ${event.result} мм</span>` : ''}
                    </li>
                `;
            });
            content += '</ul>';
        }

        Utils.showModal('События дня', content);
    },

    showAddEventModal() {
        Utils.showModal('Добавить событие', `
            <form id="add-event-form">
                <div class="form-group">
                    <label for="event-title">Название события:</label>
                    <input type="text" id="event-title" required>
                </div>
                <div class="form-group">
                    <label for="event-date">Дата:</label>
                    <input type="date" id="event-date" required>
                </div>
                <button type="submit" class="btn btn-primary">Добавить</button>
            </form>
        `);

        document.getElementById('add-event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('event-title').value;
            const date = document.getElementById('event-date').value;
            this.addEvent(title, date);
            Utils.closeModal();
            this.renderCalendarGrid();
            this.renderEvents();
        });
    },

    addEvent(title, date) {
        const newEvent = {
            id: Date.now().toString(),
            title: title,
            date: date,
            type: 'custom'
        };
        this.events.push(newEvent);
        this.saveCustomEvents();
        Utils.showNotification('Событие успешно добавлено', 'success');
    },

    deleteEvent(eventId) {
        this.events = this.events.filter(event => event.id !== eventId);
        this.saveCustomEvents();
        this.renderCalendarGrid();
        this.renderEvents();
        Utils.showNotification('Событие удалено', 'warning');
    },

    saveCustomEvents() {
        const customEvents = this.events.filter(event => event.type === 'custom');
        localStorage.setItem('calendarEvents', JSON.stringify(customEvents));
    },

    refresh() {
        this.events = [];
        this.loadEvents();
        this.renderCalendarGrid();
        this.renderEvents();
    }
};