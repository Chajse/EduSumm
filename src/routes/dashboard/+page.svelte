<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Navbar from '$lib/components/navbar.svelte';
    import Chart from 'chart.js/auto';

    let { data }: { data: PageData } = $props();

    // Dashboard data
    let stats = {
        totalStudents: 0,
        averageGrade: 0,
        enrollmentRate: 0
    };

    let enrollmentByYear = {
        firstYear: 0,
        secondYear: 0,
        thirdYear: 0,
        fourthYear: 0
    };

    let gradeDistribution = {
        midterm: {
            '90-100': 0,
            '80-89': 0,
            '70-79': 0,
            '60-69': 0,
            'Below 60': 0
        },
        finals: {
            '90-100': 0,
            '80-89': 0,
            '70-79': 0,
            '60-69': 0,
            'Below 60': 0
        }
    };

    let recentActivities = [
        { action: 'System initialized', time: 'Just now', type: 'system' },
        { action: 'Ready to add students', time: 'Just now', type: 'students' },
        { action: 'Ready to record grades', time: 'Just now', type: 'grades' }
    ];

    let enrollmentChart: Chart;
    let midtermChart: Chart;
    let finalsChart: Chart;

    onMount(() => {
        // Initialize enrollment chart
        const enrollmentCtx = document.getElementById('enrollmentChart') as HTMLCanvasElement;
        enrollmentChart = new Chart(enrollmentCtx, {
            type: 'bar',
            data: {
                labels: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
                datasets: [{
                    label: 'Students Enrolled',
                    data: [
                        enrollmentByYear.firstYear,
                        enrollmentByYear.secondYear,
                        enrollmentByYear.thirdYear,
                        enrollmentByYear.fourthYear
                    ],
                    backgroundColor: [
                        'rgba(97, 85, 187, 0.5)',
                        'rgba(29, 65, 94, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgb(97, 85, 187)',
                        'rgb(29, 65, 94)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Enrollment by Year Level'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Students'
                        }
                    }
                }
            }
        });

        // Initialize midterm grades chart
        const midtermCtx = document.getElementById('midtermChart') as HTMLCanvasElement;
        midtermChart = new Chart(midtermCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(gradeDistribution.midterm),
                datasets: [{
                    data: Object.values(gradeDistribution.midterm),
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 99, 132, 0.5)'
                    ],
                    borderColor: [
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 99, 132)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Midterm Grade Distribution'
                    },
                    legend: {
                        position: 'right'
                    }
                }
            }
        });

        // Initialize finals grades chart
        const finalsCtx = document.getElementById('finalsChart') as HTMLCanvasElement;
        finalsChart = new Chart(finalsCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(gradeDistribution.finals),
                datasets: [{
                    data: Object.values(gradeDistribution.finals),
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 99, 132, 0.5)'
                    ],
                    borderColor: [
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 99, 132)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Finals Grade Distribution'
                    },
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    });
</script>

<!-- Navbar -->
<Navbar />

<!-- Dashboard Content -->
<div class="page-container">
    <div class="content-container">
        <h1 class="page-title">Dashboard</h1>

        <!-- Stats Cards -->
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <span class="dashboard-label">Total Students</span>
                <div class="dashboard-stat">{stats.totalStudents}</div>
            </div>

            <div class="dashboard-card">
                <span class="dashboard-label">Average Grade</span>
                <div class="dashboard-stat">{stats.averageGrade}%</div>
            </div>

            <div class="dashboard-card">
                <span class="dashboard-label">Enrollment Rate</span>
                <div class="dashboard-stat">{stats.enrollmentRate}%</div>
            </div>
        </div>

        <!-- Enrollment Chart -->
        <div class="chart-container mt-6">
            <canvas id="enrollmentChart"></canvas>
        </div>

        <!-- Grade Distribution Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <!-- Midterm Grades Chart -->
            <div class="chart-container">
                <canvas id="midtermChart"></canvas>
            </div>

            <!-- Finals Grades Chart -->
            <div class="chart-container">
                <canvas id="finalsChart"></canvas>
            </div>
        </div>

        <!-- Recent Activities -->
        <div class="activity-feed">
            <h3 class="text-lg font-semibold mb-4">Recent Activities</h3>
            {#each recentActivities as activity}
                <div class="activity-item">
                    <p class="text-sm">{activity.action}</p>
                    <span class="activity-time">{activity.time}</span>
                </div>
            {/each}
        </div>
    </div>
</div>