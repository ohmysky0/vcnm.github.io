// js/tuberculin.js

const Tuberculin = {
    tests: [],
    childInfo: null,

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadTests();
        this.render();
        this.setupEventListeners();
    },

    loadTests() {
        const savedTests = localStorage.getItem('tuberculinTests');
        if (savedTests) {
            this.tests = JSON.parse(savedTests);
        }
    },

    saveTests() {
        localStorage.setItem('tuberculinTests', JSON.stringify(this.tests));
    },

    render() {
        this.container.innerHTML = `
            <div class="tuberculin-container">
                <div class="tuberculin-header">
                    <h2>Туберкулинодиагностика</h2>
                    <button id="add-test" class="btn btn-primary">Добавить пробу</button>
                </div>
                <div id="tests-list" class="tests-grid"></div>
            </div>
        `;
        this.renderTests();
    },

    renderTests() {
        const testsList = document.getElementById('tests-list');
        testsList.innerHTML = '';
        
        this.tests.forEach(test => {
            const testCard = this.createTestCard(test);
            testsList.appendChild(testCard);
        });
    },

    createTestCard(test) {
        const card = document.createElement('div');
        card.className = 'test-card';
        card.innerHTML = `
            <div class="test-header">
                <h3 class="test-type">${test.type === 'mantu' ? 'Проба Манту' : 'Диаскинтест'}</h3>
                <span class="test-date">${Utils.formatDate(test.date)}</span>
            </div>
            <div class="test-info">
                <p><strong>Результат:</strong> ${test.result} мм</p>
                <p><strong>Оценка:</strong> ${this.evaluateTestResult(test)}</p>
            </div>
            <div class="test-actions">
                <button class="btn-icon btn-edit" data-id="${test.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" data-id="${test.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return card;
    },

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            if (e.target.id === 'add-test') {
                this.showTestModal();
            }
        });

        document.getElementById('tests-list').addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const id = parseInt(target.dataset.id);

            if (target.classList.contains('btn-edit')) {
                this.showTestModal(id);
            } else if (target.classList.contains('btn-delete')) {
                this.showDeleteConfirmation(id);
            }
        });
    },

    showTestModal(id = null) {
        const test = id ? this.tests.find(t => t.id === id) : null;
        const modalTitle = test ? 'Редактировать пробу' : 'Добавить пробу';

        Utils.showModal(modalTitle, `
            <form id="test-form">
                <div class="form-group">
                    <label for="test-type">Тип пробы:</label>
                    <select id="test-type" required>
                        <option value="mantu" ${test && test.type === 'mantu' ? 'selected' : ''}>Проба Манту</option>
                        <option value="diaskintest" ${test && test.type === 'diaskintest' ? 'selected' : ''}>Диаскинтест</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="test-date">Дата проведения:</label>
                    <input type="date" id="test-date" required value="${test ? test.date : ''}">
                </div>
                <div class="form-group">
                    <label for="test-result">Результат (мм):</label>
                    <input type="number" id="test-result" step="0.1" min="0" required value="${test ? test.result : ''}">
                </div>
                <button type="submit" class="btn btn-primary">${test ? 'Сохранить' : 'Добавить'}</button>
            </form>
        `);

        document.getElementById('test-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                type: document.getElementById('test-type').value,
                date: document.getElementById('test-date').value,
                result: parseFloat(document.getElementById('test-result').value)
            };

            if (test) {
                this.updateTest(id, formData);
            } else {
                this.addTest(formData);
            }

            Utils.closeModal();
            this.renderTests();
        });
    },

    addTest(testData) {
        const newTest = {
            id: Date.now(),
            ...testData
        };
        this.tests.push(newTest);
        this.saveTests();
        Utils.showNotification('Проба успешно добавлена', 'success');
    },

    updateTest(id, testData) {
        const index = this.tests.findIndex(t => t.id === id);
        if (index !== -1) {
            this.tests[index] = { ...this.tests[index], ...testData };
            this.saveTests();
            Utils.showNotification('Проба успешно обновлена', 'success');
        }
    },

    showDeleteConfirmation(id) {
        const test = this.tests.find(t => t.id === id);
        Utils.showModal('Подтверждение удаления', `
            <p>Вы уверены, что хотите удалить пробу от ${Utils.formatDate(test.date)}?</p>
            <div class="modal-actions">
                <button id="confirm-delete" class="btn btn-danger">Удалить</button>
                <button id="cancel-delete" class="btn btn-secondary">Отмена</button>
            </div>
        `);

        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.deleteTest(id);
            Utils.closeModal();
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            Utils.closeModal();
        });
    },

    deleteTest(id) {
        this.tests = this.tests.filter(t => t.id !== id);
        this.saveTests();
        this.renderTests();
        Utils.showNotification('Проба удалена', 'warning');
    },

    evaluateTestResult(test) {
        if (test.type === 'mantu') {
            if (test.result === 0) return 'Отрицательная';
            if (test.result > 0 && test.result <= 5) return 'Сомнительная';
            if (test.result > 5 && test.result <= 17) return 'Положительная';
            if (test.result > 17) return 'Гиперергическая';
        } else if (test.type === 'diaskintest') {
            if (test.result === 0) return 'Отрицательная';
            if (test.result > 0 && test.result < 5) return 'Сомнительная';
            if (test.result >= 5 && test.result <= 14) return 'Положительная';
            if (test.result > 14) return 'Гиперергическая';
        }
        return 'Неопределенная';
    },

    getTests() {
        return this.tests;
    }
    
};