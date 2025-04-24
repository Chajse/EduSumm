<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';
    import { onMount } from 'svelte';

    let grade = {
        studentId: '',
        subjectId: '',
        midtermGrade: '',
        finalGrade: '',
        semester: '',
        year: ''
    };

    let grades: any[] = [];
    let editingGrade: any = null;
    let successMessage = '';
    let errorMessage = '';
    let showError = false;

    onMount(async () => {
        await fetchGrades();
    });

    async function fetchGrades() {
        try {
            const response = await fetch('/api/grades');
            const result = await response.json();
            grades = result.data;
        } catch (error) {
            console.error('Error fetching grades:', error);
            errorMessage = 'Failed to load grades';
            showError = true;
        }
    }

    async function submitGrade() {
        if (
            grade.studentId &&
            grade.subjectId &&
            grade.midtermGrade &&
            grade.finalGrade &&
            grade.semester &&
            grade.year
        ) {
            try {
                // Convert string values to integers
                const gradeData = {
                    studentId: parseInt(grade.studentId),
                    subjectId: parseInt(grade.subjectId),
                    midtermGrade: Math.round(parseFloat(grade.midtermGrade)), // Round to nearest integer
                    finalGrade: Math.round(parseFloat(grade.finalGrade)), // Round to nearest integer
                    semester: grade.semester,
                    year: parseInt(grade.year)
                };

                // Validate numeric values
                if (isNaN(gradeData.studentId) || isNaN(gradeData.subjectId) ||
                    isNaN(gradeData.midtermGrade) || isNaN(gradeData.finalGrade) ||
                    isNaN(gradeData.year)) {
                    errorMessage = 'Please enter valid numeric values';
                    successMessage = '';
                    showError = true;
                    return;
                }

                const response = await fetch('/api/grades', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(gradeData)
                });

                const result = await response.json();

                if (response.ok) {
                    successMessage = result.message || 'Grade submitted successfully!';
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
                    // Refresh the grades list
                    await fetchGrades();
                } else {
                    errorMessage = result.error || 'Failed to submit grade';
                    successMessage = '';
                    showError = true;
                }
            } catch (error) {
                errorMessage = 'Failed to submit grade';
                successMessage = '';
                showError = true;
                console.error('Error submitting grade:', error);
            }
        } else {
            successMessage = '';
            errorMessage = 'Please fill out all fields before submitting.';
            showError = true;
        }
    }

    async function startEdit(grade: any) {
        editingGrade = { ...grade };
    }

    async function updateGrade() {
        if (!editingGrade) return;

        try {
            const gradeData = {
                id: editingGrade.id,
                studentId: parseInt(editingGrade.studentId),
                subjectId: parseInt(editingGrade.subjectId),
                midtermGrade: Math.round(parseFloat(editingGrade.midtermGrade)),
                finalGrade: Math.round(parseFloat(editingGrade.finalGrade)),
                semester: editingGrade.semester,
                year: parseInt(editingGrade.year)
            };

            // Validate numeric values
            if (Object.values(gradeData).some(val => typeof val === 'number' && isNaN(val))) {
                errorMessage = 'Please enter valid numeric values';
                successMessage = '';
                showError = true;
                return;
            }

            const response = await fetch('/api/grades', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gradeData)
            });

            const result = await response.json();

            if (response.ok) {
                successMessage = 'Grade updated successfully!';
                errorMessage = '';
                showError = false;
                editingGrade = null;
                await fetchGrades();
            } else {
                errorMessage = result.error || 'Failed to update grade';
                successMessage = '';
                showError = true;
            }
        } catch (error) {
            console.error('Error updating grade:', error);
            errorMessage = 'Failed to update grade';
            showError = true;
        }
    }

    async function deleteGrade(id: number) {
        if (!confirm('Are you sure you want to delete this grade?')) return;

        try {
            const response = await fetch('/api/grades', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();

            if (response.ok) {
                successMessage = 'Grade deleted successfully!';
                errorMessage = '';
                showError = false;
                await fetchGrades();
            } else {
                errorMessage = result.error || 'Failed to delete grade';
                successMessage = '';
                showError = true;
            }
        } catch (error) {
            console.error('Error deleting grade:', error);
            errorMessage = 'Failed to delete grade';
            showError = true;
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Grade Form Content -->
<div class="page-container">
    <!-- Add Grade Form Container -->
    <div class="content-container">
        <h2 class="page-title">Record Grades</h2>

        <!-- Success Message Popup -->
        {#if successMessage}
            <div class="success-popup">
                {successMessage}
            </div>
        {/if}

        <!-- Error Message Popup -->
        {#if errorMessage}
            <div class="error-popup">
                {errorMessage}
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
                    <option value="3">Mid Year</option>
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
            <div class="md:col-span-2 form-submit-container">
                <button
                    type="submit"
                    class="submit-button"
                >
                    Submit Grade
                </button>
            </div>
        </form>
    </div>

    <!-- Grades List Container -->
    <div class="content-container">
        <div class="table-container">
            <h3>Grades History</h3>
            <div class="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Subject ID</th>
                            <th>Midterm</th>
                            <th>Final</th>
                            <th>Semester</th>
                            <th>Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each grades as grade}
                            <tr>
                                <td>
                                    {#if editingGrade?.id === grade.id}
                                        <div class="edit-field">
                                            <input
                                                type="text"
                                                bind:value={editingGrade.studentId}
                                                class="edit-form"
                                                placeholder="Student ID"
                                            />
                                        </div>
                                    {:else}
                                        {grade.studentId}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingGrade?.id === grade.id}
                                        <div class="edit-field">
                                            <input
                                                type="text"
                                                bind:value={editingGrade.subjectId}
                                                class="edit-form"
                                                placeholder="Subject ID"
                                            />
                                        </div>
                                    {:else}
                                        {grade.subjectId}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingGrade?.id === grade.id}
                                        <div class="edit-field">
                                            <input
                                                type="number"
                                                bind:value={editingGrade.midtermGrade}
                                                class="edit-form"
                                                min="0"
                                                max="100"
                                                placeholder="Midterm Grade"
                                            />
                                        </div>
                                    {:else}
                                        {grade.midtermGrade}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingGrade?.id === grade.id}
                                        <div class="edit-field">
                                            <input
                                                type="number"
                                                bind:value={editingGrade.finalGrade}
                                                class="edit-form"
                                                min="0"
                                                max="100"
                                                placeholder="Final Grade"
                                            />
                                        </div>
                                    {:else}
                                        {grade.finalGrade}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingGrade?.id === grade.id}
                                        <div class="edit-field">
                                            <select bind:value={editingGrade.semester} class="edit-form">
                                                <option value="1">First Semester</option>
                                                <option value="2">Second Semester</option>
                                                <option value="3">Mid Year</option>
                                            </select>
                                        </div>
                                    {:else}
                                        {grade.semester}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingGrade?.id === grade.id}
                                        <div class="edit-field">
                                            <input
                                                type="number"
                                                bind:value={editingGrade.year}
                                                class="edit-form"
                                                min="2000"
                                                max="2100"
                                                placeholder="Year"
                                            />
                                        </div>
                                    {:else}
                                        {grade.year}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingGrade?.id === grade.id}
                                        <button
                                            on:click={updateGrade}
                                            class="status-button status-active"
                                        >
                                            Save
                                        </button>
                                        <button
                                            on:click={() => editingGrade = null}
                                            class="status-button status-inactive"
                                        >
                                            Cancel
                                        </button>
                                    {:else}
                                        <button
                                            on:click={() => startEdit(grade)}
                                            class="status-button status-pending"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            on:click={() => deleteGrade(grade.id)}
                                            class="status-button status-inactive"
                                        >
                                            Delete
                                        </button>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
    .input-sm {
        width: 100%;
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        border-width: 1px;
        border-radius: 0.375rem;
        border-color: rgb(209 213 219);
    }
    .input-sm:focus {
        outline: none;
        border-color: rgb(99 102 241);
        box-shadow: 0 0 0 1px rgb(99 102 241);
    }
    .edit-field {
        padding: 0.25rem;
    }
</style>