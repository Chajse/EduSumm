<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';

    let grade = {
        studentId: '',
        subjectId: '',
        midtermGrade: '',
        finalGrade: '',
        semester: '',
        year: ''
    };

    let successMessage = '';
    let errorMessage = '';

    function submitGrade() {
        if (
            grade.studentId &&
            grade.subjectId &&
            grade.midtermGrade &&
            grade.finalGrade &&
            grade.semester &&
            grade.year
        ) {
            console.log('Submitted Grade:', grade);
            successMessage = 'Grade recorded successfully!';
            errorMessage = '';
            // Reset the form
            grade = {
                studentId: '',
                subjectId: '',
                midtermGrade: '',
                finalGrade: '',
                semester: '',
                year: ''
            };
        } else {
            successMessage = '';
            errorMessage = 'Please fill out all fields before submitting.';
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Grade Form Content -->
<div class="grades-content max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 shadow-xl rounded-xl">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
        Record Student Grade
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

    <form on:submit|preventDefault={submitGrade} class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label class="title-label">Student ID</label>
            <input
                type="text"
                bind:value={grade.studentId}
                class="input"
                placeholder="2024001"
            />
        </div>

        <div>
            <label class="title-label">Subject ID</label>
            <input
                type="text"
                bind:value={grade.subjectId}
                class="input"
                placeholder="CS101"
            />
        </div>

        <div>
            <label class="label">Midterm Grade</label>
            <input
                type="number"
                step="0.01"
                bind:value={grade.midtermGrade}
                class="input"
                placeholder="e.g. 89.5"
            />
        </div>

        <div>
            <label for="final-grade" class="title-label">Final Grade</label>
            <input
                id="final-grade"
                type="number"
                step="0.01"
                bind:value={grade.finalGrade}
                class="input"
                placeholder="e.g. 91.0"
            />
        </div>

        <div>
            <label for="semester" class="title-label">Semester</label>
            <select id="semester" bind:value={grade.semester} class="input">
                <option value="">Select</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="Summer">Summer</option>
            </select>
        </div>

        <div>
            <label for="school-year" class="title-label">School Year</label>
            <input
                id="school-year"
                type="text"
                bind:value={grade.year}
                class="input"
                placeholder="2024–2025"
            />
        </div>

        <div class="md:col-span-2 text-right mt-4">
            <button
                type="submit"
                class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all font-semibold"
            >
                Save Grade
            </button>
        </div>
    </form>
</div>