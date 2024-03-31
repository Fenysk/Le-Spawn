<script setup lang='ts'>
definePageMeta({
    middleware: ['auth', 'admin'],
});

import { eachDayOfInterval, eachHourOfInterval, eachMinuteOfInterval, eachMonthOfInterval, format, subDays, subHours, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
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
    type: string;
    createdAt: string;
    value: number;
    userId: string | null;
};

type Statistics = {
    count: number;
    types: string[];
    stats: Statistic[];
};

const categories = ref<string[]>([])

const currentCategory = ref('LOGIN');
const currentTimeLaps = ref('hour');

const now = new Date(); // Current time, for demonstration purposes
const timeLaps = computed(() => {
    switch (currentTimeLaps.value) {
        case 'hour':
            const startHour = subHours(now, 1);
            return eachMinuteOfInterval({ start: startHour, end: now }).map(date => format(date, 'HH:mm', { locale: fr }));
        case 'today':
            const startToday = subDays(now, 1);
            return eachHourOfInterval({ start: startToday, end: now }).map(date => format(date, 'HH:00 (EE)', { locale: fr }));
        case 'week':
            const startWeek = subDays(now, 7);
            return eachDayOfInterval({ start: startWeek, end: now }).map(date => format(date, 'EE dd', { locale: fr }));
        case 'month':
            const startMonth = subMonths(now, 1);
            return eachDayOfInterval({ start: startMonth, end: now }).map(date => format(date, 'dd MMMM', { locale: fr }));
        case 'year':
            const startYear = subMonths(now, 12);
            return eachMonthOfInterval({ start: startYear, end: now }).map(date => format(date, 'MMMM yy', { locale: fr }));
        default:
            return [];
    }
});

const dataToDisplay = computed(() => {
    const filteredStats = statistics.value.stats.filter(stat => stat.type === currentCategory.value);
    return timeLaps.value.map(time => filteredStats.filter(stat =>
        format(new Date(stat.createdAt), 'HH:mm', { locale: fr }) === time ||
        format(new Date(stat.createdAt), 'HH:00 (EE)', { locale: fr }) === time ||
        format(new Date(stat.createdAt), 'EE dd', { locale: fr }) === time ||
        format(new Date(stat.createdAt), 'dd MMMM', { locale: fr }) === time ||
        format(new Date(stat.createdAt), 'MMMM yy', { locale: fr }) === time)
        .reduce((acc, curr) => acc + curr.value, 0));

});

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
            categories: timeLaps.value
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


const fetchStatistics = async () => {
    loading.value = true;
    try {
        statistics.value = await statisticsService.getAllStatistics();
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};

const setCurrentCategory = async (category: StatType) => {
    currentCategory.value = category;
};

const setCurrentTimeLapse = async (event: Event) => {
    const textCategory = (event.target as HTMLButtonElement).textContent as string;
    currentTimeLaps.value = textCategory.toLowerCase();
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
            <section>
                <div id="Categories" class="flex flex-wrap gap-2">
                    <Button v-for="category in categories" @click="setCurrentCategory(category as StatType)"
                        :key="category" :disabled="currentCategory === category">{{ category }}</Button>
                </div>

                <highchart id="Graph" :options="options" class="mt-2"></highchart>

                <div id="Timelaps" class="mt-1 flex gap-2">
                    <Button @click="setCurrentTimeLapse" :disabled="currentTimeLaps === 'hour'">Hour</Button>
                    <Button @click="setCurrentTimeLapse" :disabled="currentTimeLaps === 'today'">Today</Button>
                    <Button @click="setCurrentTimeLapse" :disabled="currentTimeLaps === 'week'">Week</Button>
                    <Button @click="setCurrentTimeLapse" :disabled="currentTimeLaps === 'month'">Month</Button>
                    <Button @click="setCurrentTimeLapse" :disabled="currentTimeLaps === 'year'">Year</Button>
                </div>

                <div id="Options">

                </div>

                <div id="Logs">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Value</th>
                                <th>UserId</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="stat in statistics.stats" :key="stat.createdAt">
                                <td>{{ stat.type }}</td>
                                <td>{{ stat.createdAt }}</td>
                                <td>{{ stat.value }}</td>
                                <td>{{ stat.userId }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </section>
        </main>

    </div>
</template>
