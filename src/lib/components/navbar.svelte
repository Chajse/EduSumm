<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { theme } from '$lib/dark/theme';

    function toggleTheme() {
        theme.update(t => t === 'light' ? 'dark' : 'light');

    }

    let isMobile = false;
    let activePage = 'dashboard';

    $: {
        if ($page.url.pathname === '/') {
            activePage = 'dashboard';
        } else if ($page.url.pathname === '/grades') {
            activePage = 'grades';
        } else if ($page.url.pathname === '/students') {
            activePage = 'students';
        } else if ($page.url.pathname === '/subjects') {
            activePage = 'subjects';
        }
        else if ($page.url.pathname === '/enrollmentdate') {
            activePage = 'enrollmentdate';
        } 
    }

    onMount(() => {
        if (browser) {
            isMobile = window.innerWidth < 768;
        }
    });

    $: $page.url.pathname;


</script>

<header class="navbar bg-primary text-white shadow flex items-center justify-between px-6 py-3 fixed w-full z-50">
    <!-- Brand Section -->
    <div class="navbar-brand text-lg font-bold">
        EduSumm
    </div>

    <!-- Centered Navigation Links -->
    <nav class="flex-1 flex justify-center">
        <div class="flex space-x-6">
                <a 
                    href="/dashboard" 
                    class="nav-item nav-link flex items-center gap-2 text-sm"
                    class:active={activePage === 'dashboard'}
                >
                    <i class="fas fa-home"></i>
                    Dashboard
                </a>
                <a 
                    href="/students" 
                    class="nav-item nav-link flex items-center gap-2 text-sm"
                    class:active={activePage === 'students'}
                >
                    <i class="fas fa-users"></i>
                    Students
                </a>
                <a 
                    href="/subjects" 
                    class="nav-item nav-link flex items-center gap-2 text-sm"
                    class:active={activePage === 'subjects'}
                >
                    <i class="fas fa-book"></i>
                    Subjects
                </a>
                <a 
                    href="/grades" 
                    class="nav-item nav-link flex items-center gap-2 text-sm"
                    class:active={activePage === 'grades'}
                >
                    <i class="fas fa-users"></i>
                    Grades
                </a>
                <a 
                    href="/enrollmentdate" 
                    class="nav-item nav-link flex items-center gap-2 text-sm"
                    class:active={activePage === 'enrollmentdate'}
                >
                    <i class="fas fa-calendar-alt"></i>
                    Enrollment Date
                </a>
                <a 
                    href="/summary" 
                    class="nav-item nav-link flex items-center gap-2 text-sm"
                    class:active={activePage === 'summary'}
                >
                    <i class="fas fa-chart-bar"></i>
                    Summary
                </a>
        </div>
    </nav>

    <!--color theme switch-->
    <div class="theme-switch-container ">
        <input type="checkbox" class="theme-switch-input" id="theme-toggle" checked={$theme === 'dark'} on:change={toggleTheme} />
        <div class="display">
            <label for="theme-toggle">
                <div class="circle">
                    <svg class="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
                    </svg>
                    <svg class="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
                    </svg>
                </div>
            </label>
        </div>
    </div>
</header>
