// js/vaccines.js

const Vaccines = {
    vaccines: [],
    childInfo: null,
    standardVaccines: [
        { name: 'Гепатит В', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'БЦЖ', dose: '0.05 мл', administration: 'Внутрикожно' },
        { name: 'БЦЖ-М', dose: '0.025 мл', administration: 'Внутрикожно' },
        { name: 'Пневмококковая', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'АКДС', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'ИПВ', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'ОПВ', dose: '2 капли', administration: 'Перорально' },
        { name: 'Гемофильная инфекция тип b', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'Корь', dose: '0.5 мл', administration: 'Подкожно' },
        { name: 'Краснуха', dose: '0.5 мл', administration: 'Подкожно' },
        { name: 'Эпидемический паротит', dose: '0.5 мл', administration: 'Подкожно' },
        { name: 'АДС-М', dose: '0.5 мл', administration: 'Внутримышечно' },
        { name: 'Грипп', dose: '0.5 мл', administration: 'Внутримышечно' },
    ],
    administrationRoutes: ['Внутримышечно', 'Подкожно', 'Внутрикожно', 'Перорально'],

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadVaccines();
        this.render();
        this.setupEventListeners();
    },

    loadVaccines() {
        const savedVaccines = localStorage.getItem('vaccines');
        if (savedVaccines) {
            this.vaccines = JSON.parse(savedVaccines);
        } else {
            this.vaccines = [
                { id: 1, name: 'Гепатит В', scheduledDays: 0, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V1' },
                { id: 2, name: 'БЦЖ', scheduledDays: 3, completed: false, dose: '0.05 мл', administration: 'Внутрикожно', type: 'V1' },
                { id: 3, name: 'Гепатит В', scheduledDays: 30, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V2' },
                { id: 4, name: 'Пневмококковая', scheduledDays: 60, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V1' },
                { id: 5, name: 'АКДС', scheduledDays: 90, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V1' },
                { id: 6, name: 'ИПВ', scheduledDays: 90, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V1' },
                { id: 7, name: 'Гемофильная инфекция тип b', scheduledDays: 90, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V1' },
                { id: 8, name: 'АКДС', scheduledDays: 120, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V2' },
                { id: 9, name: 'Гепатит В', scheduledDays: 150, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V3' },
                { id: 10, name: 'ИПВ', scheduledDays: 150, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V2' },
                { id: 11, name: 'Пневмококковая', scheduledDays: 150, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V2' },
                { id: 12, name: 'АКДС', scheduledDays: 180, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V3' },
                { id: 13, name: 'ИПВ', scheduledDays: 180, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V3' },
                { id: 14, name: 'Гемофильная инфекция тип b', scheduledDays: 180, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'V3' },
                { id: 15, name: 'Корь', scheduledDays: 365, completed: false, dose: '0.5 мл', administration: 'Подкожно', type: 'V1' },
                { id: 16, name: 'Краснуха', scheduledDays: 365, completed: false, dose: '0.5 мл', administration: 'Подкожно', type: 'V1' },
                { id: 17, name: 'Эпидемический паротит', scheduledDays: 365, completed: false, dose: '0.5 мл', administration: 'Подкожно', type: 'V1' },
                { id: 18, name: 'Пневмококковая', scheduledDays: 450, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'RV' },
                { id: 19, name: 'АКДС', scheduledDays: 540, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'RV1' },
                { id: 20, name: 'ИПВ', scheduledDays: 540, completed: false, dose: '0.5 мл', administration: 'Внутримышечно', type: 'RV1' },
            ];
            this.saveVaccines();
        }
    },

    saveVaccines() {
        localStorage.setItem('vaccines', JSON.stringify(this.vaccines));
    },

    render() {
        this.container.innerHTML = `
            <div class="vaccines-container">
                <div class="vaccines-header">
                    <h2>Вакцины</h2>
                    <button id="add-vaccine" class="btn btn-primary">Добавить вакцину</button>
                </div>
                <div class="search-filter">
                    <input type="text" id="vaccine-search" placeholder="Поиск вакцины" class="search-input">
                    <select id="vaccine-filter" class="filter-select">
                        <option value="all">Все статусы</option>
                        <option value="completed">Выполнено</option>
                        <option value="pending">Ожидает</option>
                    </select>
                    <button id="show-upcoming" class="btn btn-secondary">Показать ближайшие</button>
                </div>
                <div id="vaccines-list" class="vaccines-grid"></div>
            </div>
        `;
        this.renderVaccines();
    },

    renderVaccines(vaccines = this.vaccines) {
        const vaccinesList = document.getElementById('vaccines-list');
        vaccinesList.innerHTML = '';
        
        vaccines.forEach(vaccine => {
            const vaccineCard = this.createVaccineCard(vaccine);
            vaccinesList.appendChild(vaccineCard);
        });
    },

    createVaccineCard(vaccine) {
        const card = document.createElement('div');
        card.className = 'vaccine-card';
        card.innerHTML = `
            <div class="vaccine-header">
                <h3 class="vaccine-name">${vaccine.name} (${vaccine.type})</h3>
                <span class="vaccine-status ${vaccine.completed ? 'status-completed' : 'status-pending'}">
                    ${vaccine.completed ? 'Выполнено' : 'Ожидает'}
                </span>
            </div>
            <div class="vaccine-info">
                <p><strong>Доза:</strong> ${vaccine.dose}</p>
                <p><strong>Способ введения:</strong> ${vaccine.administration}</p>
                <p><strong>Плановая дата:</strong> ${this.calculateScheduledDate(vaccine.scheduledDays)}</p>
            </div>
            <div class="vaccine-actions">
                <button class="btn-icon btn-toggle" data-id="${vaccine.id}">
                    <i class="fas ${vaccine.completed ? 'fa-times' : 'fa-check'}"></i>
                </button>
                <button class="btn-icon btn-edit" data-id="${vaccine.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" data-id="${vaccine.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return card;
    },

    calculateScheduledDate(days) {
        if (!this.childInfo || !this.childInfo.birthdate) {
            return 'Дата рождения не указана';
        }
        const birthDate = new Date(this.childInfo.birthdate);
        const scheduledDate = new Date(birthDate.getTime() + days * 24 * 60 * 60 * 1000);
        return scheduledDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
    },

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            if (e.target.id === 'add-vaccine') {
                this.showVaccineModal();
            }
            if (e.target.id === 'show-upcoming') {
                this.showUpcomingVaccines();
            }
        });

        document.getElementById('vaccine-search').addEventListener('input', () => this.filterVaccines());
        document.getElementById('vaccine-filter').addEventListener('change', () => this.filterVaccines());
        
        document.getElementById('vaccines-list').addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const id = parseInt(target.dataset.id);

            if (target.classList.contains('btn-toggle')) {
                this.toggleVaccine(id);
            } else if (target.classList.contains('btn-edit')) {
                this.showVaccineModal(id);
            } else if (target.classList.contains('btn-delete')) {
                this.showDeleteConfirmation(id);
            }
        });
    },

    filterVaccines() {
        const searchTerm = document.getElementById('vaccine-search').value.toLowerCase();
        const filterStatus = document.getElementById('vaccine-filter').value;

        const filteredVaccines = this.vaccines.filter(vaccine => {
            const matchesSearch = vaccine.name.toLowerCase().includes(searchTerm);
            const matchesFilter = filterStatus === 'all' || 
                                  (filterStatus === 'completed' && vaccine.completed) ||
                                  (filterStatus === 'pending' && !vaccine.completed);
            return matchesSearch && matchesFilter;
        });

        this.renderVaccines(filteredVaccines);
    },

    showUpcomingVaccines() {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        const upcomingVaccines = this.vaccines
            .filter(v => !v.completed)
            .map(v => ({
                ...v,
                scheduledDate: new Date(new Date(this.childInfo.birthdate).getTime() + v.scheduledDays * 24 * 60 * 60 * 1000)
            }))
            .filter(v => v.scheduledDate > now && v.scheduledDate <= nextMonth)
            .sort((a, b) => a.scheduledDate - b.scheduledDate);

        if (upcomingVaccines.length === 0) {
            // If no vaccines in the next month, show the next closest ones
            const closestVaccines = this.vaccines
                .filter(v => !v.completed)
                .map(v => ({
                    ...v,
                    scheduledDate: new Date(new Date(this.childInfo.birthdate).getTime() + v.scheduledDays * 24 * 60 * 60 * 1000)
                }))
                .filter(v => v.scheduledDate > now)
                .sort((a, b) => a.scheduledDate - b.scheduledDate)
                .slice(0, 3);  // Show the next 3 closest vaccines

            this.renderVaccines(closestVaccines);
        } else {
            this.renderVaccines(upcomingVaccines);
        }
    },

    showVaccineModal(id = null) {
        const vaccine = id ? this.vaccines.find(v => v.id === id) : null;
        const modalTitle = vaccine ? 'Редактировать вакцину' : 'Добавить вакцину';

        let vaccineOptions = this.standardVaccines.map(v => `<option value="${v.name}">${v.name}</option>`).join('');
        let administrationOptions = this.administrationRoutes.map(route => `<option value="${route}">${route}</option>`).join('');

        Utils.showModal(modalTitle, `
            <form id="vaccine-form">
                <div class="form-group">
                    <label for="vaccine-name">Название вакцины:</label>
                    <select id="vaccine-name" required>
                        <option value="">Выберите вакцину</option>
                        ${vaccineOptions}
                        <option value="custom">Другая вакцина</option>
                    </select>
                </div>
                <div id="custom-vaccine-fields" style="display:none;">
                    <div class="form-group">
                        <label for="custom-vaccine-name">Название:</label>
                        <input type="text" id="custom-vaccine-name">
                    </div>
                </div>
                <div class="form-group">
                    <label for="vaccine-dose">Доза:</label>
                    <input type="text" id="vaccine-dose" required value="${vaccine ? vaccine.dose : ''}">
                </div>
                <div class="form-group">
                    <label for="vaccine-administration">Способ введения:</label>
                    <select id="vaccine-administration" required>
                        ${administrationOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label for="vaccine-type">Тип вакцины (V1, V2, RV и т.д.):</label>
                    <input type="text" id="vaccine-type" required value="${vaccine ? vaccine.type : ''}">
                </div>
                <div class="form-group">
                    <label for="vaccine-date">Плановая дата:</label>
                    <input type="date" id="vaccine-date" required value="${vaccine ? this.calculateScheduledDateForInput(vaccine.scheduledDays) : ''}">
                </div>
                <div class="form-group">
                    <label for="vaccine-completed">Статус:</label>
                    <select id="vaccine-completed" required>
                        <option value="false" ${vaccine && !vaccine.completed ? 'selected' : ''}>Ожидает</option>
                        <option value="true" ${vaccine && vaccine.completed ? 'selected' : ''}>Выполнено</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">${vaccine ? 'Сохранить' : 'Добавить'}</button>
            </form>
        `);

        const vaccineNameSelect = document.getElementById('vaccine-name');
        const customVaccineFields = document.getElementById('custom-vaccine-fields');
        const vaccineAdministrationSelect = document.getElementById('vaccine-administration');

        vaccineNameSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customVaccineFields.style.display = 'block';
            } else {
                customVaccineFields.style.display = 'none';
                const selectedVaccine = this.standardVaccines.find(v => v.name === e.target.value);
                if (selectedVaccine) {
                    document.getElementById('vaccine-dose').value = selectedVaccine.dose;
                    vaccineAdministrationSelect.value = selectedVaccine.administration;
                }
            }
        });

        document.getElementById('vaccine-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: vaccineNameSelect.value === 'custom' ? document.getElementById('custom-vaccine-name').value : vaccineNameSelect.value,
                dose: document.getElementById('vaccine-dose').value,
                administration: vaccineAdministrationSelect.value,
                type: document.getElementById('vaccine-type').value,
                scheduledDays: this.calculateDaysFromBirth(document.getElementById('vaccine-date').value),
                completed: document.getElementById('vaccine-completed').value === 'true'
            };

            if (vaccine) {
                this.updateVaccine(id, formData);
            } else {
                this.addVaccine(formData);
            }

            Utils.closeModal();
            this.renderVaccines();
        });
    },

    calculateScheduledDateForInput(days) {
        if (!this.childInfo || !this.childInfo.birthdate) {
            return '';
        }
        const birthDate = new Date(this.childInfo.birthdate);
        const scheduledDate = new Date(birthDate.getTime() + days * 24 * 60 * 60 * 1000);
        return scheduledDate.toISOString().split('T')[0];
    },

    calculateDaysFromBirth(dateString) {
        if (!this.childInfo || !this.childInfo.birthdate) {
            return 0;
        }
        const birthDate = new Date(this.childInfo.birthdate);
        const selectedDate = new Date(dateString);
        const diffTime = Math.abs(selectedDate - birthDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    },

    addVaccine(vaccineData) {
        const newVaccine = {
            id: Date.now(),
            ...vaccineData
        };
        this.vaccines.push(newVaccine);
        this.saveVaccines();
        Utils.showNotification('Вакцина успешно добавлена', 'success');
    },

    updateVaccine(id, vaccineData) {
        const index = this.vaccines.findIndex(v => v.id === id);
        if (index !== -1) {
            this.vaccines[index] = { ...this.vaccines[index], ...vaccineData };
            this.saveVaccines();
            Utils.showNotification('Вакцина успешно обновлена', 'success');
        }
    },

    toggleVaccine(id) {
        const vaccine = this.vaccines.find(v => v.id === id);
        if (vaccine) {
            vaccine.completed = !vaccine.completed;
            this.saveVaccines();
            this.renderVaccines();
            Utils.showNotification(`Вакцина ${vaccine.completed ? 'выполнена' : 'отменена'}`, 'info');
        }
    },

    showDeleteConfirmation(id) {
        const vaccine = this.vaccines.find(v => v.id === id);
        Utils.showModal('Подтверждение удаления', `
            <p>Вы уверены, что хотите удалить вакцину "${vaccine.name} (${vaccine.type})"?</p>
            <div class="modal-actions">
                <button id="confirm-delete" class="btn btn-danger">Удалить</button>
                <button id="cancel-delete" class="btn btn-secondary">Отмена</button>
            </div>
        `);

        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.deleteVaccine(id);
            Utils.closeModal();
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            Utils.closeModal();
        });
    },

    deleteVaccine(id) {
        this.vaccines = this.vaccines.filter(v => v.id !== id);
        this.saveVaccines();
        this.renderVaccines();
        Utils.showNotification('Вакцина удалена', 'warning');
    },

    getVaccines() {
        return this.vaccines;
    },

    getUpcomingVaccines(birthdate) {
        const now = new Date();
        const birth = new Date(birthdate);
        return this.vaccines
            .filter(v => !v.completed)
            .map(v => ({
                ...v,
                scheduledDate: new Date(birth.getTime() + v.scheduledDays * 24 * 60 * 60 * 1000)
            }))
            .filter(v => v.scheduledDate > now)
            .sort((a, b) => a.scheduledDate - b.scheduledDate)
            .slice(0, 3);
    }
};