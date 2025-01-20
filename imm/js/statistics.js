// js/statistics.js

const Statistics = {
    childInfo: null,

    init(container, childInfo) {
        this.container = container;
        this.childInfo = childInfo;
        this.render();
        this.setupEventListeners();
    },

    render() {
        this.container.innerHTML = `
            <div class="statistics-container">
                <h2>Статистика</h2>
                <div class="statistics-grid">
                    <div class="statistic-card" id="vaccine-stats">
                        <h3>Вакцинация</h3>
                        <canvas id="vaccine-chart"></canvas>
                    </div>
                    <div class="statistic-card" id="growth-stats">
                        <h3>Рост и вес</h3>
                        <canvas id="growth-chart"></canvas>
                    </div>
                    <div class="statistic-card" id="tuberculin-stats">
                        <h3>Туберкулинодиагностика</h3>
                        <canvas id="tuberculin-chart"></canvas>
                    </div>
                    <div class="statistic-card" id="checkup-stats">
                        <h3>Профосмотры</h3>
                        <canvas id="checkup-chart"></canvas>
                    </div>
                </div>
                <div class="export-section">
                    <button id="export-stats" class="btn btn-primary">Экспортировать статистику</button>
                </div>
            </div>
        `;

        this.renderVaccineStats();
        this.renderGrowthStats();
        this.renderTuberculinStats();
        this.renderCheckupStats();
    },

    renderVaccineStats() {
        const vaccines = Vaccines.getVaccines();
        const completed = vaccines.filter(v => v.completed).length;
        const pending = vaccines.length - completed;

        const ctx = document.getElementById('vaccine-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Выполнено', 'Ожидает'],
                datasets: [{
                    data: [completed, pending],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 206, 86, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Статус вакцинации'
                    }
                }
            }
        });
    },

    renderGrowthStats() {
        const measurements = Growth.measurements;
        const weights = measurements.map(m => ({ x: new Date(m.date), y: m.weight }));
        const heights = measurements.map(m => ({ x: new Date(m.date), y: m.height }));

        const ctx = document.getElementById('growth-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Вес (кг)',
                        data: weights,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        yAxisID: 'y-weight',
                    },
                    {
                        label: 'Рост (см)',
                        data: heights,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        yAxisID: 'y-height',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    },
                    'y-weight': {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    'y-height': {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    },

    renderTuberculinStats() {
        const tests = Tuberculin.getTests();
        const mantuResults = tests.filter(t => t.type === 'mantu').map(t => ({ x: new Date(t.date), y: t.result }));
        const dstResults = tests.filter(t => t.type === 'diaskintest').map(t => ({ x: new Date(t.date), y: t.result }));

        const ctx = document.getElementById('tuberculin-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Проба Манту',
                        data: mantuResults,
                        borderColor: 'rgba(75, 192, 192, 1)',
                    },
                    {
                        label: 'Диаскинтест',
                        data: dstResults,
                        borderColor: 'rgba(255, 99, 132, 1)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Результат (мм)'
                        }
                    }
                }
            }
        });
    },

    renderCheckupStats() {
        const checkups = Checkup.checkups;
        const checkupCounts = {};

        checkups.forEach(checkup => {
            const year = new Date(checkup.date).getFullYear();
            checkupCounts[year] = (checkupCounts[year] || 0) + 1;
        });

        const years = Object.keys(checkupCounts);
        const counts = Object.values(checkupCounts);

        const ctx = document.getElementById('checkup-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Количество профосмотров',
                    data: counts,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Количество профосмотров'
                        }
                    }
                }
            }
        });
    },

    setupEventListeners() {
        document.getElementById('export-stats').addEventListener('click', () => this.exportStatistics());
    },

    exportStatistics() {
        const vaccines = Vaccines.getVaccines();
        const measurements = Growth.measurements;
        const tuberculinTests = Tuberculin.getTests();
        const checkups = Checkup.checkups;

        let csvContent = "data:text/csv;charset=utf-8,";

        // Vaccine stats
        csvContent += "Вакцинация\n";
        csvContent += "Название,Статус,Дата\n";
        vaccines.forEach(v => {
            csvContent += `${v.name},${v.completed ? 'Выполнено' : 'Ожидает'},${v.completed ? this.formatDate(v.completedDate) : '-'}\n`;
        });

        csvContent += "\nРост и вес\n";
        csvContent += "Дата,Вес (кг),Рост (см)\n";
        measurements.forEach(m => {
            csvContent += `${this.formatDate(m.date)},${m.weight},${m.height}\n`;
        });

        csvContent += "\nТуберкулинодиагностика\n";
        csvContent += "Дата,Тип,Результат (мм)\n";
        tuberculinTests.forEach(t => {
            csvContent += `${this.formatDate(t.date)},${t.type === 'mantu' ? 'Проба Манту' : 'Диаскинтест'},${t.result}\n`;
        });

        csvContent += "\nПрофосмотры\n";
        csvContent += "Дата,Специалисты\n";
        checkups.forEach(c => {
            csvContent += `${this.formatDate(c.date)},${c.specialists.join(', ')}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "child_health_statistics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
};