// js/app.js

const App = {
    currentModule: null,
    childInfo: null,

    init() {
        this.loadChildInfo();
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setDefaultTheme();
        Vaccines.loadVaccines();
        Tuberculin.loadTests();
    },

    loadChildInfo() {
        const savedChildInfo = localStorage.getItem('childInfo');
        if (savedChildInfo) {
            this.childInfo = JSON.parse(savedChildInfo);
            this.loadLastModule();
        } else {
            this.showChildInfoModal();
        }
    },

    showChildInfoModal() {
        Utils.showModal('Информация о ребенке', `
            <form id="child-info-form">
                <div class="form-group">
                    <label for="child-name">Имя ребенка:</label>
                    <input type="text" id="child-name" required>
                </div>
                <div class="form-group">
                    <label for="child-birthdate">Дата рождения:</label>
                    <input type="date" id="child-birthdate" required>
                </div>
                <div class="form-group">
                    <label for="child-gender">Пол:</label>
                    <select id="child-gender" required>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Сохранить</button>
            </form>
        `);

        document.getElementById('child-info-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const childInfo = {
                name: document.getElementById('child-name').value,
                birthdate: document.getElementById('child-birthdate').value,
                gender: document.getElementById('child-gender').value
            };
            this.saveChildInfo(childInfo);
            Utils.closeModal();
            this.loadModule('dashboard');
        });
    },

    saveChildInfo(childInfo) {
        this.childInfo = childInfo;
        localStorage.setItem('childInfo', JSON.stringify(childInfo));
        this.updateTheme();
        if (this.currentModule === 'dashboard') {
            Dashboard.refresh();
        }
    },

    updateTheme() {
        if (this.childInfo) {
            document.body.classList.remove('male-theme', 'female-theme');
            document.body.classList.add(this.childInfo.gender === 'male' ? 'male-theme' : 'female-theme');
        }
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const module = e.currentTarget.getAttribute('href').substring(1);
                this.loadModule(module);
            });
        });
    },

    loadLastModule() {
        const lastModule = localStorage.getItem('currentModule') || 'dashboard';
        this.loadModule(lastModule);
    },

    loadModule(moduleName) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.nav-item[href="#${moduleName}"]`).classList.add('active');

        document.getElementById('page-title').textContent = this.capitalizeFirstLetter(moduleName);

        const mainContainer = document.getElementById('main-container');
        mainContainer.innerHTML = '';

        switch (moduleName) {
            case 'dashboard':
                Dashboard.init(mainContainer, this.childInfo);
                break;
            case 'calendar':
                Calendar.init(mainContainer, this.childInfo);
                break;
            case 'vaccines':
                Vaccines.init(mainContainer, this.childInfo);
                break;
            case 'tuberculin':
                Tuberculin.init(mainContainer, this.childInfo);
                break;
            case 'growth':
                Growth.init(mainContainer, this.childInfo);
                break;
            case 'feeding':
                Feeding.init(mainContainer, this.childInfo);
                break;
            case 'checkup':
                Checkup.init(mainContainer, this.childInfo);
                break;
            case 'achievements':
                Achievements.init(mainContainer);
                break;
            case 'statistics':
                Statistics.init(mainContainer, this.childInfo);
                break;  
            case 'npr':
                NPR.init(mainContainer, this.childInfo);
                break;  
            default:
                console.error('Unknown module:', moduleName);
        }

        localStorage.setItem('currentModule', moduleName);
        this.currentModule = moduleName;
    },

    setupThemeToggle() {
        const themeToggle = document.querySelector('.btn-theme-toggle');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            this.updateThemeIcon(themeToggle);
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    },

    setDefaultTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        this.updateThemeIcon(document.querySelector('.btn-theme-toggle'));
    },

    updateThemeIcon(themeToggle) {
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            text.textContent = 'Светлая тема';
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            text.textContent = 'Тёмная тема';
        }
    },

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());