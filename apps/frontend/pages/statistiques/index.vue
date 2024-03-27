<script setup lang='ts'>
definePageMeta({
    middleware: ['auth', 'admin'],
});

import { StatType } from '~/enums/stat-type.enum';
import StatisticsService from '~/services/statistics.service';


const loading = ref(false);

const statisticsService = new StatisticsService();
const statistics = ref<Statistics>({
    count: 0,
    types: [],
    stats: [],
});

type Statistic = {
    createdAt: string;
    value: number;
};

type Statistics = {
    count: number;
    types: string[];
    stats: Statistic[];
};

const timeLaps = ref<Record<string, string[]>>({
    minute: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
    today: ['00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h', '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'],
    week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    year: ['2024', '2025', '2026', '2027', '2028', '2029', '2030']
});

const categories = ref<string[]>([])

const currentCategory = ref('all');

const currentTimeLaps = ref('minute');

const dataToDisplay = ref<number[]>([]);

const options = computed(() => {
    return {
        chart: {
            type: 'line',
            animation: {
                enabled: false
            }
        },
        title: {
            text: 'Statistiques',
        },
        legend: {
            enabled: false,
        },
        xAxis: {
            gridLineColor: 'transparent',
            categories: timeLaps.value[currentTimeLaps.value],
        },
        yAxis: {
            title: null,
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false,
                },
                dataLabels: {
                    enabled: false,
                },
                enableMouseTracking: true,
            }
        },
        series: [
            {
                name: 'line',
                lineWidth: '4px',
                color: {
                    linearGradient: {},
                    stops: [
                        [0, 'hsl(var(--accent))'],
                        [1, 'hsl(var(--accent))'],
                    ],
                },
                data: dataToDisplay.value,
            },
        ],
        credits: { text: 'Le-Spawn.fr' },
    };
});

const setTimeLapse = (event: Event) => {
    const textCategory = (event.target as HTMLButtonElement).textContent;
    if (!textCategory) return;
    currentTimeLaps.value = textCategory.toLowerCase();

    switch (currentTimeLaps.value) {
        case 'minute':
            dataToDisplay.value = getMinuteData();
            break;
        case 'today':
            dataToDisplay.value = getTodayData();
            break;
        case 'week':
            dataToDisplay.value = getWeekData();
            break;
        case 'month':
            dataToDisplay.value = getMonthData();
            break;
        case 'year':
            dataToDisplay.value = getYearData();
            break;
    }
};

const getMinuteData = () => {
    const minuteData = Array.from({ length: 60 }, () => 0); // Création d'un tableau de 60 éléments initialisés à 0 pour stocker les données par minute

    const currentTime = new Date(); // Obtenir l'heure actuelle
    const lastHour = currentTime.getHours() - 1; // Obtenir l'heure précédente

    statistics.value.stats.forEach((stat) => { // Parcourir les statistiques
        const statDate = new Date(stat.createdAt);
        const statHour = statDate.getHours(); // Obtenir l'heure de création de la statistique
        const minute = statDate.getMinutes(); // Obtenir la minute de création de la statistique

        if (statHour !== lastHour) { // Vérifier si la statistique n'appartient pas à l'heure précédente
            minuteData[minute] += stat.value; // Ajouter la valeur de la statistique à la minute correspondante dans le tableau
        }
    });

    return minuteData;
};


const getTodayData = () => {
    return timeLaps.value[currentTimeLaps.value].map((category: string) => {
        const [hour] = category.split('h');
        return statistics.value.stats.reduce((acc: number, stat: Statistic) => {
            const [statHour] = stat.createdAt.split('T')[1].split(':');
            return statHour === hour ? acc + stat.value : acc;
        }, 0);
    });
};

const getWeekData = () => {
    return timeLaps.value[currentTimeLaps.value].map((category: string) => {
        return statistics.value.stats.reduce((acc: number, stat: Statistic) => {
            const statDay = new Date(stat.createdAt).toLocaleString('en-US', { weekday: 'long' });
            return statDay === category ? acc + stat.value : acc;
        }, 0);
    });
};

const getMonthData = () => {
    return timeLaps.value[currentTimeLaps.value].map((category: string) => {
        return statistics.value.stats.reduce((acc: number, stat: Statistic) => {
            const statMonth = new Date(stat.createdAt).toLocaleString('en-US', { month: 'short' });
            return statMonth === category ? acc + stat.value : acc;
        }, 0);
    });
};

const getYearData = () => {
    return timeLaps.value[currentTimeLaps.value].map((category: string) => {
        return statistics.value.stats.reduce((acc: number, stat: Statistic) => {
            const statYear = new Date(stat.createdAt).toLocaleString('en-US', { year: 'numeric' });
            return statYear === category ? acc + stat.value : acc;
        }, 0);
    });
};

const fetchStatistics = async () => {
    loading.value = true;
    try {
        statistics.value = await statisticsService.getAllStatistics();
        dataToDisplay.value = getMinuteData();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const fetchCategoryStatistics = async (category: StatType) => {
    loading.value = true;
    currentCategory.value = category;
    try {
        statistics.value = await statisticsService.getSpecificStatistics({
            type: category,
        });

        switch (currentTimeLaps.value) {
            case 'minute':
                dataToDisplay.value = getMinuteData();
                break;
            case 'today':
                dataToDisplay.value = getTodayData();
                break;
            case 'week':
                dataToDisplay.value = getWeekData();
                break;
            case 'month':
                dataToDisplay.value = getMonthData();
                break;
            case 'year':
                dataToDisplay.value = getYearData();
                break;
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await fetchStatistics();
    categories.value = statistics.value.types;
    currentCategory.value = categories.value[0];
});
</script>

<template>
    <div class='page'>
        <header>
            <h1>Statistiques</h1>
        </header>

        <main>
            // tabs
            <section>

                <div class="flex gap-2">
                    <Button v-for="category in categories" @click="fetchCategoryStatistics(category as StatType)"
                        :key="category" :disabled="currentCategory === category">{{ category }}</Button>
                </div>

                <highchart :options="options" class="mt-2"></highchart>

                <div class="mt-1 flex gap-2">
                    <Button @click="setTimeLapse" :disabled="currentTimeLaps === 'minute'">Minute</Button>
                    <Button @click="setTimeLapse" :disabled="currentTimeLaps === 'today'">Today</Button>
                    <Button @click="setTimeLapse" :disabled="currentTimeLaps === 'week'">Week</Button>
                    <Button @click="setTimeLapse" :disabled="currentTimeLaps === 'month'">Month</Button>
                    <Button @click="setTimeLapse" :disabled="currentTimeLaps === 'year'">Year</Button>
                </div>
            </section>
        </main>

        <footer>
            // footer
        </footer>

        <pre class="max-h-64 overflow-auto bg-secondary">currentTimeLaps : {{ currentTimeLaps }}</pre>
        <pre class="max-h-64 overflow-auto bg-secondary">dataToDisplay : {{ dataToDisplay }}</pre>
        <pre class="max-h-64 overflow-auto bg-secondary">timeLaps : {{ timeLaps }}</pre>
        <pre class="max-h-64 overflow-auto bg-secondary">statistics : {{ statistics }}</pre>

    </div>
</template>
