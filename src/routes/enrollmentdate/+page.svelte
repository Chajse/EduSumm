<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';

    let enrollment = {
        studentId: '',
        subjectId: '',
        semester: '',
        year: '',
        status: ''
    };

    let successMessage = '';
    let errorMessage = '';

    function submitEnrollment() {
        if (
            enrollment.studentId &&
            enrollment.subjectId &&
            enrollment.semester &&
            enrollment.year &&
            enrollment.status
        ) {
            console.log('Enrollment Data:', enrollment);
            successMessage = 'Enrollment submitted successfully!';
            errorMessage = '';
            // Reset the form
            enrollment = {
                studentId: '',
                subjectId: '',
                semester: '',
                year: '',
                status: ''
            };
        } else {
            successMessage = '';
            errorMessage = 'Please fill out all fields before submitting.';
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Enrollment Form Content -->
<div class="enrollment-content max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
        Record Enrollment
    </h2>

    <!-- Success and Error Messages -->
    {#if successMessage}
        <div class="p-4 mb-4 text-green-800 bg-green-100 rounded-lg">
            {successMessage}
        </div>
    {/if}
    {#if errorMessage}
        <div class="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
            {errorMessage}
        </div>
    {/if}

    <form on:submit|preventDefault={submitEnrollment} class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label class="label">Student ID</label>
            <input
                type="text"
                bind:value={enrollment.studentId}
                class="input"
                placeholder="Enter Student ID"
            />
        </div>

        <div>
            <label class="label">Subject ID</label>
            <input
                type="text"
                bind:value={enrollment.subjectId}
                class="input"
                placeholder="Enter Subject ID"
            />
        </div>

        <div>
            <label class="label">Semester</label>
            <select bind:value={enrollment.semester} class="input">
                <option value="" disabled>Select semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="Summer">Summer</option>
            </select>
        </div>

        <div>
            <label class="label">Year</label>
            <input
                type="number"
                bind:value={enrollment.year}
                class="input"
                placeholder="e.g. 2025"
            />
        </div>

        <div class="md:col-span-2">
            <label class="label">Status</label>
            <select bind:value={enrollment.status} class="input">
                <option value="" disabled>Select status</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Dropped">Dropped</option>
                <option value="Completed">Completed</option>
            </select>
        </div>

        <div class="md:col-span-2 text-right mt-4">
            <button
                type="submit"
                class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all font-semibold"
            >
                Submit Enrollment
            </button>
        </div>
    </form>
</div>