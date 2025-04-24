<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';
    import { onMount } from 'svelte';

    let enrollment = {
        studentId: '',
        subjectId: '',
        semester: '',
        year: '',
        status: ''
    };

    let enrollments: any[] = [];
    let students: any[] = [];
    let subjects: any[] = [];
    let editingEnrollment: any = null;
    let successMessage = '';
    let errorMessage = '';
    let showError = false;

    // Function to convert semester number to text
    function getSemesterText(semester: string | number): string {
        const semesterMap: { [key: string]: string } = {
            '1': 'First Semester',
            '2': 'Second Semester',
            '3': 'Mid Year'
        };
        return semesterMap[semester?.toString()] || 'Unknown Semester';
    }

    onMount(async () => {
        await Promise.all([
            fetchEnrollments(),
            fetchStudents(),
            fetchSubjects()
        ]);
    });

    async function fetchStudents() {
        try {
            const response = await fetch('/api/students');
            const result = await response.json();
            students = result.data;
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    async function fetchSubjects() {
        try {
            const response = await fetch('/api/subjects');
            const result = await response.json();
            subjects = result.data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }

    async function fetchEnrollments() {
        try {
            const response = await fetch('/api/enrollment');
            const result = await response.json();
            enrollments = result.data;
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            errorMessage = 'Failed to load enrollments';
            showError = true;
        }
    }

    async function submitEnrollment() {
        if (
            enrollment.studentId &&
            enrollment.subjectId &&
            enrollment.semester &&
            enrollment.year &&
            enrollment.status
        ) {
            try {
                // Convert string values to appropriate types
                const enrollmentData = {
                    studentId: parseInt(enrollment.studentId),
                    subjectId: parseInt(enrollment.subjectId),
                    semester: enrollment.semester,
                    year: parseInt(enrollment.year),
                    status: enrollment.status
                };

                // Validate numeric values
                if (isNaN(enrollmentData.studentId) || isNaN(enrollmentData.subjectId) || 
                    isNaN(enrollmentData.year)) {
                    errorMessage = 'Please enter valid numeric values for Student ID, Subject ID, and Year';
                    successMessage = '';
                    showError = true;
                    return;
                }

                const response = await fetch('/api/enrollment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(enrollmentData)
                });

                const result = await response.json();

                if (response.ok) {
                    successMessage = result.message || 'Enrollment submitted successfully!';
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
                    // Refresh the enrollment list
                    await fetchEnrollments();
                } else {
                    errorMessage = result.error || 'Failed to submit enrollment';
                    successMessage = '';
                    showError = true;
                }
            } catch (error) {
                errorMessage = 'Failed to submit enrollment';
                successMessage = '';
                showError = true;
                console.error('Error submitting enrollment:', error);
            }
        } else {
            successMessage = '';
            errorMessage = 'Please fill out all fields before submitting.';
            showError = true;
        }
    }

    async function startEdit(enrollment: any) {
        editingEnrollment = { ...enrollment };
    }

    async function updateEnrollment() {
        if (!editingEnrollment) return;

        try {
            const response = await fetch('/api/enrollment', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: editingEnrollment.id,
                    studentId: parseInt(editingEnrollment.studentId),
                    subjectId: parseInt(editingEnrollment.subjectId),
                    semester: editingEnrollment.semester,
                    year: parseInt(editingEnrollment.year),
                    status: editingEnrollment.status
                })
            });

            const result = await response.json();

            if (response.ok) {
                successMessage = 'Enrollment updated successfully!';
                errorMessage = '';
                showError = false;
                editingEnrollment = null;
                await fetchEnrollments();
            } else {
                errorMessage = result.error || 'Failed to update enrollment';
                successMessage = '';
                showError = true;
            }
        } catch (error) {
            console.error('Error updating enrollment:', error);
            errorMessage = 'Failed to update enrollment';
            showError = true;
        }
    }

    async function deleteEnrollment(id: number) {
        if (!confirm('Are you sure you want to delete this enrollment?')) return;

        try {
            const response = await fetch('/api/enrollment', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();

            if (response.ok) {
                successMessage = 'Enrollment deleted successfully!';
                errorMessage = '';
                showError = false;
                await fetchEnrollments();
            } else {
                errorMessage = result.error || 'Failed to delete enrollment';
                successMessage = '';
                showError = true;
            }
        } catch (error) {
            console.error('Error deleting enrollment:', error);
            errorMessage = 'Failed to delete enrollment';
            showError = true;
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Enrollment Form Content -->
<div class="page-container">
    <!-- Add Enrollment Form Container -->
    <div class="content-container">
        <h2 class="page-title">Record Enrollment</h2>

        <!-- Success Message Popup -->
        {#if successMessage}
            <div class="success-popup">
                {successMessage}
            </div>
        {/if}

        <!-- Error Message Popup -->
        {#if errorMessage}
            <div class="error-popup center-popup">
                <div class="popup-content">
                    {errorMessage}
                </div>
            </div>
        {/if}

        <form on:submit|preventDefault={submitEnrollment} class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="title-label {showError ? 'error' : ''}">Student</label>
                <select
                    bind:value={enrollment.studentId}
                    class="input {showError ? 'form-error' : ''}"
                >
                    <option value="">Select Student</option>
                    {#each students as student}
                        <option value={student.id}>
                            {student.firstName} {student.lastName}
                        </option>
                    {/each}
                </select>
            </div>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Subject</label>
                <select
                    bind:value={enrollment.subjectId}
                    class="input {showError ? 'form-error' : ''}"
                >
                    <option value="">Select Subject</option>
                    {#each subjects as subject}
                        <option value={subject.id}>
                            {subject.subjectCode} - {subject.subjectName}
                        </option>
                    {/each}
                </select>
            </div>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Semester</label>
                <select bind:value={enrollment.semester} class="input {showError ? 'form-error' : ''}">
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
                    bind:value={enrollment.year}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="2024"
                    min="2000"
                    max="2100"
                />
            </div>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Status</label>
                <select bind:value={enrollment.status} class="input {showError ? 'form-error' : ''}">
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

    <!-- Enrollment List Container -->
    <div class="content-container">
        <div class="table-container">
            <h3>Enrollment History</h3>
            <div class="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Subject Code</th>
                            <th>Semester</th>
                            <th>Year</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each enrollments as enrollment}
                            <tr>
                                <td>
                                    {#if editingEnrollment?.id === enrollment.id}
                                        <div class="edit-field">
                                            <select
                                                bind:value={editingEnrollment.studentId}
                                                class="edit-form"
                                            >
                                                {#each students as student}
                                                    <option value={student.id}>
                                                        {student.firstName} {student.lastName}
                                                    </option>
                                                {/each}
                                            </select>
                                        </div>
                                    {:else}
                                        {enrollment.studentName || 'Unknown Student'}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingEnrollment?.id === enrollment.id}
                                        <div class="edit-field">
                                            <select
                                                bind:value={editingEnrollment.subjectId}
                                                class="edit-form"
                                            >
                                                {#each subjects as subject}
                                                    <option value={subject.id}>
                                                        {subject.subjectCode} - {subject.subjectName}
                                                    </option>
                                                {/each}
                                            </select>
                                        </div>
                                    {:else}
                                        {enrollment.subjectCode || 'Unknown Subject'}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingEnrollment?.id === enrollment.id}
                                        <div class="edit-field">
                                            <select bind:value={editingEnrollment.semester} class="edit-form">
                                                <option value="1">First Semester</option>
                                                <option value="2">Second Semester</option>
                                                <option value="3">Mid Year</option>
                                            </select>
                                        </div>
                                    {:else}
                                        {getSemesterText(enrollment.semester)}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingEnrollment?.id === enrollment.id}
                                        <div class="edit-field">
                                            <input
                                                type="number"
                                                bind:value={editingEnrollment.year}
                                                class="edit-form"
                                                min="2000"
                                                max="2100"
                                                placeholder="Year"
                                            />
                                        </div>
                                    {:else}
                                        {enrollment.year}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingEnrollment?.id === enrollment.id}
                                        <div class="edit-field">
                                            <select bind:value={editingEnrollment.status} class="edit-form">
                                                <option value="Enrolled">Enrolled</option>
                                                <option value="Dropped">Dropped</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </div>
                                    {:else}
                                        {enrollment.status}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingEnrollment?.id === enrollment.id}
                                        <button
                                            on:click={updateEnrollment}
                                            class="status-button status-active"
                                        >
                                            Save
                                        </button>
                                        <button
                                            on:click={() => editingEnrollment = null}
                                            class="status-button status-inactive"
                                        >
                                            Cancel
                                        </button>
                                    {:else}
                                        <button
                                            on:click={() => startEdit(enrollment)}
                                            class="status-button status-pending"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            on:click={() => deleteEnrollment(enrollment.id)}
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
    .text-gray-500 {
        color: #6b7280;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: block;
    }
    .center-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 90%;
    }
    .popup-content {
        text-align: center;
        color: #ef4444;
        font-weight: 500;
    }
</style>