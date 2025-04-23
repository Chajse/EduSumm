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
    let showError = false;

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
            showError = false;
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
            errorMessage = '';
            showError = true;
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Enrollment Form Content -->
<div class="page-container">
    <div class="content-container">
        <h2 class="page-title">
            Record Enrollment
        </h2>

        <!-- Success Message Popup -->
        {#if successMessage}
            <div class="success-popup">
                {successMessage}
            </div>
        {/if}

        <form on:submit|preventDefault={submitEnrollment} class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="title-label {showError ? 'error' : ''}">Student ID</label>
                <input
                    type="text"
                    bind:value={enrollment.studentId}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="Enter Student ID"
                />
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Subject ID</label>
                <input
                    type="text"
                    bind:value={enrollment.subjectId}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="Enter Subject ID"
                />
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Semester</label>
                <select 
                    bind:value={enrollment.semester} 
                    class="input {showError ? 'form-error' : ''}"
                >
                    <option value="">Select Semester</option>
                    <option value="1st">1st Semester</option>
                    <option value="2nd">2nd Semester</option>
                    <option value="Summer">Summer</option>
                </select>
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Year</label>
                <input
                    type="number"
                    bind:value={enrollment.year}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="e.g. 2025"
                    min="2000"
                    max="2100"
                />
            </div>

            <div class="md:col-span-2">
                <label class="title-label {showError ? 'error' : ''}">Status</label>
                <select 
                    bind:value={enrollment.status} 
                    class="input {showError ? 'form-error' : ''}"
                >
                    <option value="">Select Status</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            <div class="md:col-span-2 form-submit-container">
                <button
                    type="submit"
                    class="submit-button"
                >
                    Submit Enrollment
                </button>
            </div>
        </form>
    </div>
</div>