// js/dashboard.js

const Dashboard = {
    childInfo: null,

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.render();
        this.setupEventListeners();
    },

    render() {
        this.container.innerHTML = `
            <div class="dashboard-grid">
                <div class="dashboard-card child-info">
                    <h3>Информация о ребенке</h3>
                    <div class="child-details">
                        <img src="assets/default-avatar.png" alt="" class="child-photo" id="child-photo">
                        <div class="child-data">
                            <p><strong>Имя:</strong> <span id="child-name"></span></p>
                            <p><strong>Дата рождения:</strong> <span id="child-birthdate"></span></p>
                            <p><strong>Возраст:</strong> <span id="child-age"></span></p>
                            <p><strong>Пол:</strong> <span id="child-gender"></span></p>
                        </div>
                    </div>
                    <button id="edit-child-info" class="btn btn-primary">Редактировать</button>
                </div>
                <div class="dashboard-card upcoming-vaccinations">
                    <h3>Ближайшие вакцинации</h3>
                    <ul id="upcoming-vaccinations-list"></ul>
                    <button id="view-all-vaccines" class="btn btn-secondary">Подробнее</button>
                </div>
                <div class="dashboard-card vaccination-progress">
                    <h3>Статус вакцинации</h3>
                    <div class="progress-circle">
                        <svg viewBox="0 0 36 36" class="circular-chart">
                            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                            <path class="circle" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                            <text x="18" y="20.35" class="percentage">0%</text>
                        </svg>
                    </div>
                    <p id="vaccination-status"></p>
                </div>
                <div class="dashboard-card recent-measurements">
                    <h3></h3>
                    <div id="measurements-data">
                    </div>
                </div>
            </div>
        `;
        this.updateChildInfo();
        this.updateVaccinationStatus();
        this.updateUpcomingVaccinations();
        this.updateRecentMeasurements();
    },

    updateChildInfo() {
        if (this.childInfo) {
            document.getElementById('child-name').textContent = this.childInfo.name;
            document.getElementById('child-birthdate').textContent = Utils.formatDate(this.childInfo.birthdate);
            document.getElementById('child-age').textContent = this.calculateAge(this.childInfo.birthdate);
            document.getElementById('child-gender').textContent = this.childInfo.gender === 'male' ? 'Мужской' : 'Женский';
            
            const avatar = document.getElementById('child-photo');
            avatar.src = this.childInfo.gender === 'male' ? 'assets/boy-avatar.png' : 'assets/girl-avatar.png';
        }
    },

    calculateAge(birthdate) {
        const birth = new Date(birthdate);
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();

        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
        }

        if (days < 0) {
            const monthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += monthDays;
            months--;
        }

        let ageString = '';
        if (years > 0) {
            ageString += `${years} ${this.pluralize(years, 'год', 'года', 'лет')} `;
        }
        if (months > 0 || years > 0) {
            ageString += `${months} ${this.pluralize(months, 'месяц', 'месяца', 'месяцев')} `;
        }
        ageString += `${days} ${this.pluralize(days, 'день', 'дня', 'дней')}`;
        
        return ageString.trim();
    },

    pluralize(number, one, two, five) {
        let n = Math.abs(number);
        n %= 100;
        if (n >= 5 && n <= 20) {
            return five;
        }
        n %= 10;
        if (n === 1) {
            return one;
        }
        if (n >= 2 && n <= 4) {
            return two;
        }
        return five;
    },

    updateVaccinationStatus() {
        const vaccines = Vaccines.getVaccines();
        const completed = vaccines.filter(v => v.completed).length;
        const total = vaccines.length;
        const percentage = Math.round((completed / total) * 100);

        const circle = document.querySelector('.circular-chart .circle');
        const percentageText = document.querySelector('.circular-chart .percentage');
        
        circle.style.strokeDasharray = `${percentage}, 100`;
        percentageText.textContent = `${percentage}%`;
        
        document.getElementById('vaccination-status').textContent = 
            `${completed} из ${total} вакцин выполнено`;
    },

    updateUpcomingVaccinations() {
        if (this.childInfo) {
            const upcomingVaccines = Vaccines.getUpcomingVaccines(this.childInfo.birthdate);
            const list = document.getElementById('upcoming-vaccinations-list');
            list.innerHTML = upcomingVaccines.map(vacc => `
                <li>
                    <span class="vaccine-name">${vacc.name}</span>
                    <span class="vaccine-date">${Utils.formatDate(vacc.scheduledDate)}</span>
                </li>
            `).join('');
        }
    },

    updateRecentMeasurements() {
        const measurementsContainer = document.getElementById('measurements-data');
        const measurements = Growth.measurements;

        if (measurements && measurements.length > 0) {
            const lastMeasurement = measurements[measurements.length - 1];
            measurementsContainer.innerHTML = `
                <div class="measurement-item">
                    <i class="fas fa-weight"></i>
                    <span class="measurement-value">${lastMeasurement.weight.toFixed(1)} кг</span>
                    <span class="measurement-label">Вес</span>
                </div>
                <div class="measurement-item">
                    <i class="fas fa-ruler-vertical"></i>
                    <span class="measurement-value">${lastMeasurement.height.toFixed(1)} см</span>
                    <span class="measurement-label">Рост</span>
                </div>
                <p class="measurement-date">Обновлено: ${Utils.formatDate(lastMeasurement.date)}</p>
            `;
        } else {
            measurementsContainer.innerHTML = `
                
            `;
        }
    },

    setupEventListeners() {
        document.getElementById('edit-child-info').addEventListener('click', () => {
            this.showChildInfoModal();
        });

        document.getElementById('view-all-vaccines').addEventListener('click', () => {
            App.loadModule('vaccines');
        });
    },

    showChildInfoModal() {
        Utils.showModal('Редактировать информацию о ребенке', `
            <form id="edit-child-info-form">
                <div class="form-group">
                    <label for="edit-child-name">Имя ребенка:</label>
                    <input type="text" id="edit-child-name" value="${this.childInfo.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-child-birthdate">Дата рождения:</label>
                    <input type="date" id="edit-child-birthdate" value="${this.childInfo.birthdate}" required>
                </div>
                <div class="form-group">
                    <label for="edit-child-gender">Пол:</label>
                    <select id="edit-child-gender" required>
                        <option value="male" ${this.childInfo.gender === 'male' ? 'selected' : ''}>Мужской</option>
                        <option value="female" ${this.childInfo.gender === 'female' ? 'selected' : ''}>Женский</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Сохранить</button>
            </form>
        `);

        document.getElementById('edit-child-info-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedChildInfo = {
                name: document.getElementById('edit-child-name').value,
                birthdate: document.getElementById('edit-child-birthdate').value,
                gender: document.getElementById('edit-child-gender').value
            };
            this.childInfo = updatedChildInfo;
            App.saveChildInfo(updatedChildInfo);
            Utils.closeModal();
            this.render();
            Utils.showNotification('Информация о ребенке обновлена', 'success');
        });
    },

    refresh() {
        this.childInfo = JSON.parse(localStorage.getItem('childInfo'));
        this.render();
    }
};