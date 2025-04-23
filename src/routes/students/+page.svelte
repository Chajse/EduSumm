<script lang="ts">
    import Navbar from '$lib/components/navbar.svelte';

    let student = {
        id: '',
        firstName: '',
        lastName: '',
        birthdate: '',
        email: '',
        gender: '',
        course: '',
        year: '',
        block: ''
    };

    let successMessage = '';
    let errorMessage = '';

    function submitForm() {
        if (
            student.id &&
            student.firstName &&
            student.lastName &&
            student.birthdate &&
            student.email &&
            student.gender &&
            student.course &&
            student.year &&
            student.block
        ) {
            console.log('Student Submitted:', student);
            successMessage = 'Student added successfully!';
            errorMessage = '';
            // Reset the form
            student = {
                id: '',
                firstName: '',
                lastName: '',
                birthdate: '',
                email: '',
                gender: '',
                course: '',
                year: '',
                block: ''
            };
        } else {
            successMessage = '';
            errorMessage = 'Please fill out all fields before submitting.';
        }
    }
</script>

<!-- Navbar -->
<Navbar />

<!-- Student Form Content -->
<div class="students-content max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Student</h2>

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

    <form on:submit|preventDefault={submitForm} class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Student ID</label>
            <input type="text" bind:value={student.id} class="input" placeholder="2024001" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
            <input type="text" bind:value={student.firstName} class="input" placeholder="Juan" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
            <input type="text" bind:value={student.lastName} class="input" placeholder="Dela Cruz" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Birthdate</label>
            <input type="date" bind:value={student.birthdate} class="input" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" bind:value={student.email} class="input" placeholder="juan@example.com" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
            <select bind:value={student.gender} class="input">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
            <input type="text" bind:value={student.course} class="input" placeholder="BSCS" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
            <select bind:value={student.year} class="input">
                <option value="">Select</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
            </select>
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Block</label>
            <input type="text" bind:value={student.block} class="input" placeholder="A / B / C" />
        </div>

        <div class="md:col-span-2 text-right">
            <button type="submit" class="px-6 py-2 bg-primary text-white font-semibold rounded hover:bg-primary/90">
                Submit
            </button>
        </div>
    </form>
</div>