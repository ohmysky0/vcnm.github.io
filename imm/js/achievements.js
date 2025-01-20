// js/achievements.js

const Achievements = {
    achievements: [
        { id: 1, name: 'Первая вакцина', description: 'Сделана первая вакцинация', icon: 'syringe', unlocked: false },
        { id: 2, name: 'На полпути', description: 'Выполнено 50% вакцинаций', icon: 'chart-line', unlocked: false },
        { id: 3, name: 'Полная защита', description: 'Выполнены все вакцинации', icon: 'shield-alt', unlocked: false },
        { id: 4, name: 'Точно в срок', description: 'Все вакцинации выполнены вовремя', icon: 'clock', unlocked: false },
        { id: 5, name: 'Растем и развиваемся', description: 'Добавлены первые измерения роста и веса', icon: 'child', unlocked: false },
        { id: 6, name: 'Эксперт по вакцинам', description: 'Изучена информация обо всех вакцинах', icon: 'book-medical', unlocked: false },
        { id: 7, name: 'Организованный родитель', description: 'Добавлено 5 событий в календарь', icon: 'calendar-check', unlocked: false },
        { id: 8, name: 'Внимательный родитель', description: 'Регулярное отслеживание роста и веса', icon: 'weight', unlocked: false },
    ],

    init(container) {
        this.container = container;
        this.loadAchievements();
        this.render();
        this.checkAchievements();
    },

    loadAchievements() {
        const savedAchievements = localStorage.getItem('achievements');
        if (savedAchievements) {
            this.achievements = JSON.parse(savedAchievements);
        }
    },

    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    },

    render() {
        this.container.innerHTML = `
            <div class="achievements-container">
                <h2>Достижения</h2>
                <div class="achievements-grid" id="achievements-grid"></div>
            </div>
        `;
        this.renderAchievements();
    },

    renderAchievements() {
        const achievementsGrid = document.getElementById('achievements-grid');
        achievementsGrid.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">
                    <i class="fas fa-${achievement.icon}"></i>
                </div>
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
            </div>
        `).join('');
    },

    checkAchievements() {
        // Проверка достижений на основе данных из других модулей
        this.checkVaccineAchievements();
        this.checkGrowthAchievements();
        this.checkCalendarAchievements();

        this.saveAchievements();
        this.renderAchievements();
    },

    checkVaccineAchievements() {
        const vaccines = Vaccines.getVaccines();
        const completedVaccines = vaccines.filter(v => v.completed);

        if (completedVaccines.length > 0) {
            this.unlockAchievement(1);
        }

        if (completedVaccines.length >= Math.ceil(vaccines.length / 2)) {
            this.unlockAchievement(2);
        }

        if (completedVaccines.length === vaccines.length) {
            this.unlockAchievement(3);
        }

        // Проверка на своевременность вакцинации
        const allOnTime = vaccines.every(v => {
            if (!v.completed) return true;
            const scheduledDate = new Date(App.childInfo.birthdate);
            scheduledDate.setDate(scheduledDate.getDate() + v.scheduledDays);
            return new Date(v.completedDate) <= scheduledDate;
        });

        if (allOnTime && completedVaccines.length === vaccines.length) {
            this.unlockAchievement(4);
        }
    },

    checkGrowthAchievements() {
        const measurements = Growth.measurements;

        if (measurements.length > 0) {
            this.unlockAchievement(5);
        }

        if (measurements.length >= 5) {
            this.unlockAchievement(8);
        }
    },

    checkCalendarAchievements() {
        const events = Calendar.events;
        const customEvents = events.filter(e => e.type === 'custom');

        if (customEvents.length >= 5) {
            this.unlockAchievement(7);
        }
    },

    unlockAchievement(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showAchievementNotification(achievement);
        }
    },

    showAchievementNotification(achievement) {
        Utils.showNotification(`Новое достижение разблокировано: ${achievement.name}`, 'success');
    }
};