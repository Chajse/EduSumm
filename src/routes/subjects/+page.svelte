<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';

    let subject = {
        id: '',
        subjectCode: '',
        subjectName: '',
        instructorName: '',
        units: ''
    };

    let successMessage = '';
    let errorMessage = '';
    let showError = false;

    function submitSubject() {
        if (
            subject.id &&
            subject.subjectCode &&
            subject.subjectName &&
            subject.instructorName &&
            subject.units
        ) {
            console.log('Submitted Subject:', subject);
            successMessage = 'Subject added successfully!';
            errorMessage = '';
            showError = false;
            // Reset the form
            subject = {
                id: '',
                subjectCode: '',
                subjectName: '',
                instructorName: '',
                units: ''
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

<!-- Subject Form Content -->
<div class="page-container">
    <div class="content-container">
        <h2 class="page-title">
            Add New Subject
        </h2>
        
        <!-- Success Message Popup -->
        {#if successMessage}
            <div class="success-popup">
                {successMessage}
            </div>
        {/if}

        <form on:submit|preventDefault={submitSubject} class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="title-label {showError ? 'error' : ''}">Subject ID</label>
                <input
                    type="text"
                    bind:value={subject.id}
                    class="input {showError ? 'form-error' : ''}"
                    placeholder="Enter Subject ID"
                />
            </div>

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
</div>