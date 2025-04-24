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
    let editingEnrollment: any = null;
    let successMessage = '';
    let errorMessage = '';
    let showError = false;

    onMount(async () => {
        await fetchEnrollments();
    });

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

        <!-- Error Message Popup -->
        {#if errorMessage}
            <div class="error-popup">
                {errorMessage}
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

        <!-- Enrollment History Table -->
        <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4">Enrollment History</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Semester</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                        {#each enrollments as enroll}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingEnrollment?.id === enroll.id}
                                        <input
                                            type="text"
                                            bind:value={editingEnrollment.studentId}
                                            class="input-sm"
                                        />
                                    {:else}
                                        {enroll.studentId}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingEnrollment?.id === enroll.id}
                                        <input
                                            type="text"
                                            bind:value={editingEnrollment.subjectId}
                                            class="input-sm"
                                        />
                                    {:else}
                                        {enroll.subjectId}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingEnrollment?.id === enroll.id}
                                        <select bind:value={editingEnrollment.semester} class="input-sm">
                                            <option value="1st">1st Semester</option>
                                            <option value="2nd">2nd Semester</option>
                                            <option value="Summer">Summer</option>
                                        </select>
                                    {:else}
                                        {enroll.semester}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingEnrollment?.id === enroll.id}
                                        <input
                                            type="number"
                                            bind:value={editingEnrollment.year}
                                            class="input-sm"
                                            min="2000"
                                            max="2100"
                                        />
                                    {:else}
                                        {enroll.year}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingEnrollment?.id === enroll.id}
                                        <select bind:value={editingEnrollment.status} class="input-sm">
                                            <option value="Enrolled">Enrolled</option>
                                            <option value="Dropped">Dropped</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    {:else}
                                        {enroll.status}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {#if editingEnrollment?.id === enroll.id}
                                        <button
                                            on:click={updateEnrollment}
                                            class="text-indigo-600 hover:text-indigo-900 mr-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            on:click={() => editingEnrollment = null}
                                            class="text-gray-600 hover:text-gray-900"
                                        >
                                            Cancel
                                        </button>
                                    {:else}
                                        <button
                                            on:click={() => startEdit(enroll)}
                                            class="text-indigo-600 hover:text-indigo-900 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            on:click={() => deleteEnrollment(enroll.id)}
                                            class="text-red-600 hover:text-red-900"
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
</style>