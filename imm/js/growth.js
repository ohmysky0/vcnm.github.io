// js/growth.js

const Growth = {
    childInfo: null,
    measurements: [],
    weightChart: null,
    heightChart: null,
    rfStandards: {
        // Стандарты роста и веса для РФ будут загружены сюда
    },

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.loadMeasurements();
        this.loadRFStandards();
        this.render();
        this.setupEventListeners();
    },

    loadMeasurements() {
        const savedMeasurements = localStorage.getItem('growthMeasurements');
        if (savedMeasurements) {
            this.measurements = JSON.parse(savedMeasurements);
        }
    },

    loadRFStandards() {
        // В реальном приложении здесь должна быть загрузка стандартов из файла или API
        this.rfStandards = {
            weightForAge: {
                male: {
                    0: { p3: 2.9, p15: 3.3, p50: 3.8, p85: 4.4, p97: 4.9 },
                    12: { p3: 8.7, p15: 9.4, p50: 10.4, p85: 11.5, p97: 12.4 },
                    24: { p3: 10.8, p15: 11.6, p50: 12.7, p85: 14.0, p97: 15.0 },
                    // ... добавьте больше данных для разных возрастов
                },
                female: {
                    0: { p3: 2.8, p15: 3.2, p50: 3.7, p85: 4.2, p97: 4.7 },
                    12: { p3: 8.1, p15: 8.8, p50: 9.8, p85: 10.9, p97: 11.8 },
                    24: { p3: 10.2, p15: 11.0, p50: 12.1, p85: 13.3, p97: 14.3 },
                    // ... добавьте больше данных для разных возрастов
                }
            },
            heightForAge: {
                male: {
                    0: { p3: 46.1, p15: 48.0, p50: 50.5, p85: 53.0, p97: 54.9 },
                    12: { p3: 71.7, p15: 73.5, p50: 76.1, p85: 78.7, p97: 80.5 },
                    24: { p3: 82.4, p15: 84.5, p50: 87.1, p85: 89.9, p97: 91.9 },
                    // ... добавьте больше данных для разных возрастов
                },
                female: {
                    0: { p3: 45.6, p15: 47.4, p50: 49.9, p85: 52.3, p97: 54.1 },
                    12: { p3: 70.1, p15: 72.0, p50: 74.5, p85: 77.0, p97: 78.9 },
                    24: { p3: 81.2, p15: 83.3, p50: 85.9, p85: 88.6, p97: 90.6 },
                    // ... добавьте больше данных для разных возрастов
                }
            }
        };
    },

    saveMeasurements() {
        localStorage.setItem('growthMeasurements', JSON.stringify(this.measurements));
    },

    render() {
        this.container.innerHTML = `
            <div class="growth-container">
                <h2>Физическое развитие</h2>
                <div class="growth-summary"></div>
                <div class="growth-actions">
                    <button id="add-measurement" class="btn btn-primary">Добавить измерение</button>
                    <button id="export-data" class="btn btn-secondary">Экспорт данных</button>
                </div>
                <div class="growth-charts">
                    <div class="chart-container">
                        <h3>График веса</h3>
                        <canvas id="weight-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>График роста</h3>
                        <canvas id="height-chart"></canvas>
                    </div>
                </div>
                <div id="measurements-table"></div>
            </div>
        `;
        this.renderSummary();
        this.renderCharts();
        this.renderTable();
    },

    renderSummary() {
        const summaryContainer = this.container.querySelector('.growth-summary');
        if (this.measurements.length === 0) {
            summaryContainer.innerHTML = '<p>Нет данных о измерениях</p>';
            return;
        }

        const latestMeasurement = this.measurements[this.measurements.length - 1];
        const previousMeasurement = this.measurements.length > 1 ? this.measurements[this.measurements.length - 2] : null;

        let weightChange = '';
        let heightChange = '';
        let weightPercentile = '';
        let heightPercentile = '';

        if (previousMeasurement) {
            const weightDiff = latestMeasurement.weight - previousMeasurement.weight;
            const heightDiff = latestMeasurement.height - previousMeasurement.height;

            weightChange = weightDiff > 0 ? `+${weightDiff.toFixed(1)} кг` : `${weightDiff.toFixed(1)} кг`;
            heightChange = heightDiff > 0 ? `+${heightDiff.toFixed(1)} см` : `${heightDiff.toFixed(1)} см`;
        }

        const age = this.calculateAgeInMonths(latestMeasurement.date);
        weightPercentile = this.calculatePercentile(age, latestMeasurement.weight, 'weightForAge');
        heightPercentile = this.calculatePercentile(age, latestMeasurement.height, 'heightForAge');

        summaryContainer.innerHTML = `
            <div class="summary-item">
                <h3>Текущий вес</h3>
                <p>${latestMeasurement.weight.toFixed(1)} кг ${weightChange ? `<span class="change">(${weightChange})</span>` : ''}</p>
                <p>Центиль: ${weightPercentile}</p>
            </div>
            <div class="summary-item">
                <h3>Текущий рост</h3>
                <p>${latestMeasurement.height.toFixed(1)} см ${heightChange ? `<span class="change">(${heightChange})</span>` : ''}</p>
                <p>Центиль: ${heightPercentile}</p>
            </div>
            <div class="summary-item">
                <h3>ИМТ</h3>
                <p>${this.calculateBMI(latestMeasurement.weight, latestMeasurement.height).toFixed(1)}</p>
            </div>
        `;
    },

    renderCharts() {
        this.renderWeightChart();
        this.renderHeightChart();
    },

    renderWeightChart() {
        const ctx = document.getElementById('weight-chart').getContext('2d');
        const data = this.measurements.map((m, index) => {
            const age = this.calculateAgeInMonths(m.date);
            const standard = this.getStandardForAge(age, 'weightForAge');
            const percentDifference = ((m.weight - standard.p50) / standard.p50) * 100;
            return {
                x: new Date(m.date),
                y: m.weight,
                percentDifference: percentDifference
            };
        });

        if (this.weightChart) {
            this.weightChart.destroy();
        }

        this.weightChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Вес (кг)',
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        },
                        title: {
                            display: true,
                            text: 'Дата'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Вес (кг)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const percentDifference = context.raw.percentDifference;
                                return `Отклонение от нормы: ${percentDifference.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    },

    renderHeightChart() {
        const ctx = document.getElementById('height-chart').getContext('2d');
        const data = this.measurements.map((m, index) => {
            const age = this.calculateAgeInMonths(m.date);
            const standard = this.getStandardForAge(age, 'heightForAge');
            const percentDifference = ((m.height - standard.p50) / standard.p50) * 100;
            return {
                x: new Date(m.date),
                y: m.height,
                percentDifference: percentDifference
            };
        });

        if (this.heightChart) {
            this.heightChart.destroy();
        }

        this.heightChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Рост (см)',
                    data: data,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        },
                        title: {
                            display: true,
                            text: 'Дата'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Рост (см)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const percentDifference = context.raw.percentDifference;
                                return `Отклонение от нормы: ${percentDifference.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    },

    renderTable() {
        const tableContainer = document.getElementById('measurements-table');
        if (this.measurements.length === 0) {
            tableContainer.innerHTML = '<p>Нет данных о измерениях</p>';
            return;
        }

        let tableHTML = `
            <table class="measurements-table">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Возраст</th>
                        <th>Вес (кг)</th>
                        <th>Рост (см)</th>
                        <th>ИМТ</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
        `;

        this.measurements.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(measurement => {
            const age = this.calculateAgeInMonths(measurement.date);
            const bmi = this.calculateBMI(measurement.weight, measurement.height);
            tableHTML += `
                <tr>
                    <td>${this.formatDate(measurement.date)}</td>
                    <td>${this.formatAge(age)}</td>
                    <td>${measurement.weight.toFixed(1)}</td>
                    <td>${measurement.height.toFixed(1)}</td>
                    <td>${bmi.toFixed(1)}</td>
                    <td>
                        <button class="btn btn-small btn-edit" data-id="${measurement.id}">Редактировать</button>
                        <button class="btn btn-small btn-delete" data-id="${measurement.id}">Удалить</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        tableContainer.innerHTML = tableHTML;
    },

    calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    },

    calculateAgeInMonths(date) {
        const birthDate = new Date(this.childInfo.birthdate);
        const measurementDate = new Date(date);
        const diffTime = Math.abs(measurementDate - birthDate);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        return diffMonths;
    },

    formatAge(ageInMonths) {
        const years = Math.floor(ageInMonths / 12);
        const months = ageInMonths % 12;
        return `${years ? years + ' г. ' : ''}${months} мес.`;
    },

    calculatePercentile(age, value, type) {
        const standards = this.rfStandards[type][this.childInfo.gender];
        const closestAge = Object.keys(standards).reduce((prev, curr) => {
            return (Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev);
        });
        const ageStandards = standards[closestAge];
        
        if (value < ageStandards.p3) return '<3';
        if (value < ageStandards.p15) return '3-15';
        if (value < ageStandards.p50) return '15-50';
        if (value < ageStandards.p85) return '50-85';
        if (value < ageStandards.p97) return '85-97';
        return '>97';
    },

    getStandardForAge(age, type) {
        const standards = this.rfStandards[type][this.childInfo.gender];
        const closestAge = Object.keys(standards).reduce((prev, curr) => {
            return (Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev);
        });
        return standards[closestAge];
    },

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            if (e.target.id === 'add-measurement') {
                this.showMeasurementModal();
            } else if (e.target.id === 'export-data') {
                this.exportData();
            } else if (e.target.classList.contains('btn-edit')) {
                const id = e.target.dataset.id;
                this.showMeasurementModal(id);
            } else if (e.target.classList.contains('btn-delete')) {
                const id = e.target.dataset.id;
                this.deleteMeasurement(id);
            }
        });
    },

    showMeasurementModal(id = null) {
        const measurement = id ? this.measurements.find(m => m.id === id) : null;
        const modalTitle = measurement ? 'Редактировать измерение' : 'Добавить измерение';

        Utils.showModal(modalTitle, `
            <form id="measurement-form">
                <div class="form-group">
                    <label for="measurement-date">Дата измерения:</label>
                    <input type="date" id="measurement-date" required value="${measurement ? measurement.date : ''}">
                </div>
                <div class="form-group">
                    <label for="measurement-weight">Вес (кг):</label>
                    <input type="number" id="measurement-weight" step="0.1" min="0" required value="${measurement ? measurement.weight : ''}">
                </div>
                <div class="form-group">
                    <label for="measurement-height">Рост (см):</label>
                    <input type="number" id="measurement-height" step="0.1" min="0" required value="${measurement ? measurement.height : ''}">
                </div>
                <button type="submit" class="btn btn-primary">${measurement ? 'Сохранить' : 'Добавить'}</button>
            </form>
        `);

        document.getElementById('measurement-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                date: document.getElementById('measurement-date').value,
                weight: parseFloat(document.getElementById('measurement-weight').value),
                height: parseFloat(document.getElementById('measurement-height').value)
            };

            if (measurement) {
                this.updateMeasurement(id, formData);
            } else {
                this.addMeasurement(formData);
            }

            Utils.closeModal();
            this.render();
        });
    },

    addMeasurement(data) {
        const newMeasurement = {
            id: Date.now().toString(),
            ...data
        };
        this.measurements.push(newMeasurement);
        this.saveMeasurements();
        Utils.showNotification('Измерение успешно добавлено', 'success');
    },

    updateMeasurement(id, data) {
        const index = this.measurements.findIndex(m => m.id === id);
        if (index !== -1) {
            this.measurements[index] = { ...this.measurements[index], ...data };
            this.saveMeasurements();
            Utils.showNotification('Измерение успешно обновлено', 'success');
        }
    },

    deleteMeasurement(id) {
        Utils.showModal('Подтверждение удаления', `
            <p>Вы уверены, что хотите удалить это измерение?</p>
            <div class="modal-actions">
                <button id="confirm-delete" class="btn btn-danger">Удалить</button>
                <button id="cancel-delete" class="btn btn-secondary">Отмена</button>
            </div>
        `);

        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.measurements = this.measurements.filter(m => m.id !== id);
            this.saveMeasurements();
            Utils.closeModal();
            this.render();
            Utils.showNotification('Измерение удалено', 'warning');
        });

        document.getElementById('cancel-delete').addEventListener('click', () => {
            Utils.closeModal();
        });
    },

    exportData() {
        let csv = 'Дата,Возраст (месяцы),Вес (кг),Рост (см),ИМТ,Центиль веса,Центиль роста\n';
        this.measurements.forEach(m => {
            const age = this.calculateAgeInMonths(m.date);
            const bmi = this.calculateBMI(m.weight, m.height);
            const weightPercentile = this.calculatePercentile(age, m.weight, 'weightForAge');
            const heightPercentile = this.calculatePercentile(age, m.height, 'heightForAge');
            csv += `${m.date},${age},${m.weight},${m.height},${bmi.toFixed(1)},${weightPercentile},${heightPercentile}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'growth_measurements.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
};