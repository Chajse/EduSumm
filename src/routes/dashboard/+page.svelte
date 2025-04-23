<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Navbar from '$lib/components/navbar.svelte';

    let { data }: { data: PageData } = $props();

    // Sample dashboard data
    let totalStudents = 240;
    let attendanceRate = 92;
    let subjectsCount = 14;
    let recentActivities = [
        { action: 'Added new student: John Doe', time: '2 hours ago' },
        { action: 'Marked attendance for Class 10A', time: '5 hours ago' },
        { action: 'Updated subject: Mathematics', time: 'Yesterday' }
    ];
</script>

<!-- Navbar -->
<Navbar />

<!-- Dashboard Content -->
<div class="dashboard-content p-6 space-y-6 mt-16">
    <h1 class="text-3xl font-bold">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</h2>
            <p class="text-2xl font-bold">{totalStudents}</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Rate</h2>
            <p class="text-2xl font-bold">{attendanceRate}%</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">Subjects</h2>
            <p class="text-2xl font-bold">{subjectsCount}</p>
        </div>
    </div>

    <!-- Recent Activities -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul class="space-y-3">
            {#each recentActivities as activity}
                <li class="border-l-4 border-primary pl-4">
                    <p class="text-sm">{activity.action}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </li>
            {/each}
        </ul>
    </div>
</div>