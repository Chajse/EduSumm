<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';
    import { onMount } from 'svelte';

    let subject = {
        subjectCode: '',
        subjectName: '',
        instructorName: '',
        units: ''
    };

    let subjects: any[] = [];
    let editingSubject: any = null;
    let successMessage = '';
    let errorMessage = '';
    let showError = false;

    onMount(async () => {
        await fetchSubjects();
    });

    async function fetchSubjects() {
        try {
            const response = await fetch('/api/subjects');
            const result = await response.json();
            subjects = result.data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            errorMessage = 'Failed to load subjects';
            showError = true;
        }
    }

    async function submitSubject() {
        if (
            subject.subjectCode &&
            subject.subjectName &&
            subject.instructorName &&
            subject.units
        ) {
            try {
                const response = await fetch('/api/subjects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        subjectCode: subject.subjectCode,
                        subjectName: subject.subjectName,
                        instructorName: subject.instructorName,
                        credits: parseInt(subject.units)
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    successMessage = result.message || 'Subject added successfully!';
                    errorMessage = '';
                    showError = false;
                    subject = {
                        subjectCode: '',
                        subjectName: '',
                        instructorName: '',
                        units: ''
                    };
                    await fetchSubjects();
                } else {
                    errorMessage = result.error || 'Failed to add subject';
                    successMessage = '';
                    showError = true;
                }
            } catch (error) {
                errorMessage = 'Failed to add subject';
                successMessage = '';
                showError = true;
            }
        } else {
            successMessage = '';
            errorMessage = 'Please fill in all fields';
            showError = true;
        }
    }

    async function startEdit(subject: any) {
        editingSubject = { 
            ...subject,
            units: subject.credits
        };
    }

    async function updateSubject() {
        if (!editingSubject) return;

        try {
            const response = await fetch('/api/subjects', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: editingSubject.id,
                    subjectCode: editingSubject.subjectCode,
                    subjectName: editingSubject.subjectName,
                    instructorName: editingSubject.instructorName,
                    credits: parseInt(editingSubject.units)
                })
            });

            const result = await response.json();

            if (response.ok) {
                successMessage = 'Subject updated successfully!';
                errorMessage = '';
                showError = false;
                editingSubject = null;
                await fetchSubjects();
            } else {
                errorMessage = result.error || 'Failed to update subject';
                successMessage = '';
                showError = true;
            }
        } catch (error) {
            console.error('Error updating subject:', error);
            errorMessage = 'Failed to update subject';
            showError = true;
        }
    }

    async function deleteSubject(id: number) {
        if (!confirm('Are you sure you want to delete this subject?')) return;

        try {
            const response = await fetch('/api/subjects', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();

            if (response.ok) {
                successMessage = 'Subject deleted successfully!';
                errorMessage = '';
                showError = false;
                await fetchSubjects();
            } else {
                errorMessage = result.error || 'Failed to delete subject';
                successMessage = '';
                showError = true;
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
            errorMessage = 'Failed to delete subject';
            showError = true;
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Subject Form Content -->
<div class="page-container">
    <!-- Add Subject Form Container -->
    <div class="content-container">
        <h2 class="page-title">Add New Subject</h2>

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

        <form on:submit|preventDefault={submitSubject}>
            <div>
                <label class="title-label {showError ? 'error' : ''}">Subject Code</label>
                <input
                    type="text"
                    bind:value={subject.subjectCode}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="e.g. CS101"
                />
            </div>

            <div class="md:col-span-2">
                <label class="title-label {showError ? 'error' : ''}">Subject Name</label>
                <input
                    type="text"
                    bind:value={subject.subjectName}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="Introduction to Computer Science"
                />
            </div>

            <div class="md:col-span-2">
                <label class="title-label {showError ? 'error' : ''}">Instructor Name</label>
                <input
                    type="text"
                    bind:value={subject.instructorName}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="Prof. John Doe"
                />
            </div>

            <div>
                <label class="title-label {showError ? 'error' : ''}">Units</label>
                <input
                    type="number"
                    bind:value={subject.units}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="e.g. 3"
                    min="1"
                    max="6"
                />
            </div>

            <div class="md:col-span-2 form-submit-container">
                <button
                    type="submit"
                    class="submit-button"
                >
                    Add Subject
                </button>
            </div>
        </form>
    </div>

    <!-- Subjects List Container -->
    <div class="content-container">
        <div class="table-container">
            <h3>Subjects List</h3>
            <div class="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Instructor</th>
                            <th>Units</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each subjects as subject}
                            <tr>
                                <td>
                                    {#if editingSubject?.id === subject.id}
                                        <div class="edit-field">
                                            <input
                                                type="text"
                                                bind:value={editingSubject.subjectCode}
                                                class="edit-form"
                                                placeholder="Subject Code"
                                            />
                                        </div>
                                    {:else}
                                        {subject.subjectCode}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingSubject?.id === subject.id}
                                        <div class="edit-field">
                                            <input
                                                type="text"
                                                bind:value={editingSubject.subjectName}
                                                class="edit-form"
                                                placeholder="Subject Name"
                                            />
                                        </div>
                                    {:else}
                                        {subject.subjectName}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingSubject?.id === subject.id}
                                        <div class="edit-field">
                                            <input
                                                type="text"
                                                bind:value={editingSubject.instructorName}
                                                class="edit-form"
                                                placeholder="Instructor Name"
                                            />
                                        </div>
                                    {:else}
                                        {subject.instructorName}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingSubject?.id === subject.id}
                                        <div class="edit-field">
                                            <input
                                                type="number"
                                                bind:value={editingSubject.units}
                                                class="edit-form"
                                                min="1"
                                                max="6"
                                                placeholder="Units"
                                            />
                                        </div>
                                    {:else}
                                        {subject.credits}
                                    {/if}
                                </td>
                                <td>
                                    {#if editingSubject?.id === subject.id}
                                        <button
                                            on:click={updateSubject}
                                            class="status-button status-active"
                                        >
                                            Save
                                        </button>
                                        <button
                                            on:click={() => editingSubject = null}
                                            class="status-button status-inactive"
                                        >
                                            Cancel
                                        </button>
                                    {:else}
                                        <button
                                            on:click={() => startEdit(subject)}
                                            class="status-button status-pending"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            on:click={() => deleteSubject(subject.id)}
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