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
    let showError = false;

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
            successMessage = 'Grade submitted successfully!';
            errorMessage = '';
            showError = false;
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
            showError = true;
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Grade Form Content -->
<div class="grade-container px-4">
    <div class="grades-content relative max-w-4xl mx-auto mt-16 px-8 pt-12 pb-8 bg-white dark:bg-gray-900 shadow-xl rounded-xl">
        <h2 class="record-grades-title">
            Record Grades
        </h2>
        
        {#if successMessage}
            <div class="success-popup">
                {successMessage}
            </div>
        {/if}
        
        <form on:submit|preventDefault={submitGrade} class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="title-label {showError ? 'error' : ''}">Student ID</label>
                <input
                    type="text"
                    bind:value={grade.studentId}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="2024001"
                />
            </div>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Subject ID</label>
                <input
                    type="text"
                    bind:value={grade.subjectId}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="SUB001"
                />
            </div>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Midterm Grade</label>
                <input
                    type="number"
                    bind:value={grade.midtermGrade}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="0-100"
                    min="0"
                    max="100"
                />
            </div>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Final Grade</label>
                <input
                    type="number"
                    bind:value={grade.finalGrade}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="0-100"
                    min="0"
                    max="100"
                />
            </div>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Semester</label>
                <select bind:value={grade.semester} class="input {showError ? 'form-error' : ''}">
                    <option value="">Select Semester</option>
                    <option value="1">First Semester</option>
                    <option value="2">Second Semester</option>
                    <option value="3">Summer</option>
                </select>
            </div>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Year</label>
                <input
                    type="number"
                    bind:value={grade.year}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="2024"
                    min="2000"
                    max="2100"
                />
            </div>
            <div class="md:col-span-2 submit-btn-container">
                <button
                    type="submit"
                    class="submit-grade-btn"
                >
                    Submit Grade
                </button>
            </div>
        </form>
    </div>
</div>