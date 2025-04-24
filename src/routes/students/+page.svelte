<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';
    import { onMount } from 'svelte';

    let student = {
        firstName: '',
        lastName: '',
        birthdate: '',
        email: '',
        gender: '',
        course: '',
        year: '',
        block: ''
    };

    let students: any[] = [];
    let editingStudent: any = null;
    let successMessage = '';
    let errorMessage = '';
    let showError = false;

    onMount(async () => {
        await fetchStudents();
    });

    async function fetchStudents() {
        try {
            const response = await fetch('/api/students');
            const result = await response.json();
            students = result.data;
        } catch (error) {
            console.error('Error fetching students:', error);
            errorMessage = 'Failed to load students';
            showError = true;
        }
    }

    async function submitForm() {
        if (
            student.firstName &&
            student.lastName &&
            student.birthdate &&
            student.email &&
            student.gender &&
            student.course &&
            student.year &&
            student.block
        ) {
            try {
                const response = await fetch('/api/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(student)
                });

                if (response.ok) {
                    const result = await response.json();
                    successMessage = result.message || 'Student added successfully!';
                    errorMessage = '';
                    showError = false;

                    // Reset the form
                    student = {
                        firstName: '',
                        lastName: '',
                        birthdate: '',
                        email: '',
                        gender: '',
                        course: '',
                        year: '',
                        block: ''
                    };
                    await fetchStudents();
                } else {
                    const error = await response.json();
                    errorMessage = error.error || 'Failed to add student.';
                    successMessage = '';
                    showError = true;
                }
            } catch (err) {
                errorMessage = 'An error occurred while submitting the form.';
                successMessage = '';
                showError = true;
            }
        } else {
            successMessage = '';
            errorMessage = 'Please fill out all fields.';
            showError = true;
        }
    }

    async function startEdit(student: any) {
        editingStudent = { ...student };
    }

    async function updateStudent() {
        if (!editingStudent) return;

        try {
            const response = await fetch('/api/students', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingStudent)
            });

            const result = await response.json();

            if (response.ok) {
                successMessage = 'Student updated successfully!';
                errorMessage = '';
                showError = false;
                editingStudent = null;
                await fetchStudents();
            } else {
                errorMessage = result.error || 'Failed to update student';
                successMessage = '';
                showError = true;
            }
        } catch (error) {
            console.error('Error updating student:', error);
            errorMessage = 'Failed to update student';
            showError = true;
        }
    }

    async function deleteStudent(id: number) {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const response = await fetch('/api/students', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();

            if (response.ok) {
                successMessage = 'Student deleted successfully!';
                errorMessage = '';
                showError = false;
                await fetchStudents();
            } else {
                errorMessage = result.error || 'Failed to delete student';
                successMessage = '';
                showError = true;
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            errorMessage = 'Failed to delete student';
            showError = true;
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Student Form Content -->
<div class="page-container">
    <div class="content-container">
        <h2 class="page-title">Add New Student</h2>

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

        <form on:submit|preventDefault={submitForm} class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
                <label class="title-label {showError ? 'error' : ''}">First Name</label>
                <input 
                    type="text" 
                    bind:value={student.firstName} 
                    class="input {showError ? 'form-error' : ''}" 
                    placeholder="Juan" 
                />
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Last Name</label>
                <input 
                    type="text" 
                    bind:value={student.lastName} 
                    class="input {showError ? 'form-error' : ''}" 
                    placeholder="Dela Cruz" 
                />
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Birthdate</label>
                <input 
                    type="date" 
                    bind:value={student.birthdate} 
                    class="input {showError ? 'form-error' : ''}" 
                />
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Email</label>
                <input 
                    type="email" 
                    bind:value={student.email} 
                    class="input {showError ? 'form-error' : ''}" 
                    placeholder="juan@example.com" 
                />
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Gender</label>
                <select 
                    bind:value={student.gender} 
                    class="input {showError ? 'form-error' : ''}"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Course</label>
                <input 
                    type="text" 
                    bind:value={student.course} 
                    class="input {showError ? 'form-error' : ''}" 
                    placeholder="BSCS" 
                />
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Year</label>
                <select 
                    bind:value={student.year} 
                    class="input {showError ? 'form-error' : ''}"
                >
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                </select>
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Block</label>
                <input 
                    type="text" 
                    bind:value={student.block} 
                    class="input {showError ? 'form-error' : ''}" 
                    placeholder="A / B / C" 
                />
            </div>

            <div class="md:col-span-2 form-submit-container">
                <button type="submit" class="submit-button">
                    Add Student
                </button>
            </div>
        </form>

        <!-- Students Table -->
        <div class="mt-8">
            <h3 class="text-xl font-semibold mb-4">Students List</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Year</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Block</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                        {#each students as student}
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingStudent?.id === student.id}
                                        <div class="flex gap-2">
                                            <input
                                                type="text"
                                                bind:value={editingStudent.firstName}
                                                class="input-sm w-1/2"
                                                placeholder="First Name"
                                            />
                                            <input
                                                type="text"
                                                bind:value={editingStudent.lastName}
                                                class="input-sm w-1/2"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    {:else}
                                        {student.firstName} {student.lastName}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingStudent?.id === student.id}
                                        <input
                                            type="email"
                                            bind:value={editingStudent.email}
                                            class="input-sm"
                                        />
                                    {:else}
                                        {student.email}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingStudent?.id === student.id}
                                        <input
                                            type="text"
                                            bind:value={editingStudent.course}
                                            class="input-sm"
                                        />
                                    {:else}
                                        {student.course}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingStudent?.id === student.id}
                                        <select bind:value={editingStudent.year} class="input-sm">
                                            <option value="1st">1st Year</option>
                                            <option value="2nd">2nd Year</option>
                                            <option value="3rd">3rd Year</option>
                                            <option value="4th">4th Year</option>
                                        </select>
                                    {:else}
                                        {student.year}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {#if editingStudent?.id === student.id}
                                        <input
                                            type="text"
                                            bind:value={editingStudent.block}
                                            class="input-sm"
                                        />
                                    {:else}
                                        {student.block}
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {#if editingStudent?.id === student.id}
                                        <button
                                            on:click={updateStudent}
                                            class="text-indigo-600 hover:text-indigo-900 mr-2"
                                        >
                                            Save
                                        </button>
                                        <button
                                            on:click={() => editingStudent = null}
                                            class="text-gray-600 hover:text-gray-900"
                                        >
                                            Cancel
                                        </button>
                                    {:else}
                                        <button
                                            on:click={() => startEdit(student)}
                                            class="text-indigo-600 hover:text-indigo-900 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            on:click={() => deleteStudent(student.id)}
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