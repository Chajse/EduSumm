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
    let showError = false;

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
            showError = false;
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
            errorMessage = '';
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

        <form on:submit|preventDefault={submitForm} class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="title-label {showError ? 'error' : ''}">Student ID</label>
                <input 
                    type="text" 
                    bind:value={student.id} 
                    class="input {showError ? 'form-error' : ''}" 
                    placeholder="2024001" 
                />
            </div>

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
    </div>
</div>