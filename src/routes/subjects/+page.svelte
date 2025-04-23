<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';

    let subject = {
        subjectCode: '',
        subjectName: '',
        instructorName: '',
        credits: ''
    };

    let successMessage = '';
    let errorMessage = '';

    function submitSubject() {
        if (subject.subjectCode && subject.subjectName && subject.instructorName && subject.credits) {
            console.log('Submitted Subject:', subject);
            successMessage = 'Subject added successfully!';
            errorMessage = '';
            // Reset the form
            subject = {
                subjectCode: '',
                subjectName: '',
                instructorName: '',
                credits: ''
            };
        } else {
            successMessage = '';
            errorMessage = 'Please fill out all fields before submitting.';
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Subject Form Content -->
<div class="subjects-content max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 shadow-xl rounded-xl">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
        Add New Subject
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

    <form on:submit|preventDefault={submitSubject} class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label class="label">Subject Code</label>
            <input
                type="text"
                bind:value={subject.subjectCode}
                class="input"
                placeholder="e.g. CS101"
            />
        </div>

        <div>
            <label class="label">Subject Name</label>
            <input
                type="text"
                bind:value={subject.subjectName}
                class="input"
                placeholder="Introduction to Computer Science"
            />
        </div>

        <div class="md:col-span-2">
            <label class="label">Instructor Name</label>
            <input
                type="text"
                bind:value={subject.instructorName}
                class="input"
                placeholder="Prof. John Doe"
            />
        </div>

        <div>
            <label class="label">Credits</label>
            <input
                type="number"
                bind:value={subject.credits}
                class="input"
                placeholder="e.g. 3"
            />
        </div>

        <div class="md:col-span-2 text-right mt-4">
            <button
                type="submit"
                class="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all font-semibold"
            >
                Add Subject
            </button>
        </div>
    </form>
</div>