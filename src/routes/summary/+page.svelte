<script lang="ts">
    import { fade } from 'svelte/transition';
    import Navbar from '$lib/components/navbar.svelte';

    let journalText = '';
    let messages: { text: string; isUser: boolean; error?: boolean }[] = [];
    let isLoading = false;
    $: charCount = journalText.length;
    const MAX_CHARS = 2000;

    async function handleSubmit(e: Event) {
        e.preventDefault();
        const trimmedText = journalText.trim();
        
        if (!trimmedText) {
            messages = [...messages, { 
                text: "Please enter some text to summarize.", 
                isUser: false, 
                error: true 
            }];
            return;
        }

        if (trimmedText.length > MAX_CHARS) {
            messages = [...messages, { 
                text: `Text exceeds maximum length of ${MAX_CHARS} characters.`, 
                isUser: false, 
                error: true 
            }];
            return;
        }

        messages = [...messages, { text: trimmedText, isUser: true }];
        isLoading = true;
        
        try {
            const response = await fetch('/api/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: trimmedText })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            messages = [...messages, { text: data.summary, isUser: false }];
        } catch (error) {
            messages = [...messages, { 
                text: 'Sorry, there was an error generating the summary. Please try again later.', 
                isUser: false, 
                error: true 
            }];
            console.error('Summary error:', error);
        } finally {
            isLoading = false;
            journalText = '';
        }
    }

    async function handleDatabaseSummary() {
        isLoading = true;
        messages = [...messages, { text: "Requesting database summary...", isUser: true }];
        
        try {
            const response = await fetch('/api/summary');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            messages = [...messages, { text: data.summary, isUser: false }];
        } catch (error) {
            messages = [...messages, { 
                text: 'Sorry, there was an error generating the database summary. Please try again later.', 
                isUser: false, 
                error: true 
            }];
            console.error('Database summary error:', error);
        } finally {
            isLoading = false;
        }
    }

    let messageContainer: HTMLElement;

    $: if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
</script>

<Navbar />
<div class="content-container">
    <div class="page-container">
        <!-- Header -->
        <div class="page-title flex justify-between items-center">
            <div>
                <h1>AI Summary Assistant</h1>
                <p class="text-sm opacity-80">Ask me to summarize anything</p>
            </div>
            <button 
                on:click={handleDatabaseSummary}
                class="submit-button"
                disabled={isLoading}
            >
                Database Summary
            </button>
        </div>

        <!-- Messages Container -->
        <div 
            bind:this={messageContainer}
            class="chat-container"
        >
            {#if messages.length === 0}
                <div class="empty-state">
                    <div class="icon-container">
                        <svg class="chat-icon" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <p class="empty-title">Start a conversation</p>
                    <p class="empty-subtitle">Enter your text below to get a summary</p>
                </div>
            {/if}
            
            {#each messages as message}
                <div 
                    class="message-wrapper {message.isUser ? 'user-message' : 'ai-message'}"
                    transition:fade
                >
                    <div class="message {
                        message.isUser 
                            ? 'user' 
                            : message.error
                                ? 'error'
                                : 'ai'
                    }">
                        {#if !message.isUser}
                            <div class="ai-avatar">
                                <svg class="ai-icon" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                        {/if}
                        <div class="message-text">
                            {message.text}
                        </div>
                    </div>
                </div>
            {/each}
            
            {#if isLoading}
                <div class="message-wrapper ai-message" transition:fade>
                    <div class="message ai loading">
                        <div class="ai-avatar">
                            <div class="loading-spinner"></div>
                        </div>
                        <div class="message-text">
                            Thinking...
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Input Area -->
        <div class="input-container">
            <form on:submit|preventDefault={handleSubmit} class="chat-form">
                <div class="input-wrapper">
                    <textarea 
                        bind:value={journalText}
                        placeholder="Type your message here..."
                        class="chat-input {charCount > MAX_CHARS ? 'error' : ''}"
                        rows="2"
                        disabled={isLoading}
                    ></textarea>
                    <div class="input-actions">
                        <span class="char-count {charCount > MAX_CHARS ? 'error' : ''}">
                            {charCount}/{MAX_CHARS}
                        </span>
                        <button 
                            type="submit"
                            class="send-button"
                            disabled={isLoading || charCount > MAX_CHARS}
                        >
                            <svg class="send-icon" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    .chat-container {
        height: 400px;
        overflow-y: auto;
        padding: 1rem;
        margin: 1rem 0;
        background-color: var(--color-card-bg);
        border-radius: 0.5rem;
        border: 1px solid var(--color-card-border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .empty-state {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--color-dark-text);
        opacity: 0.7;
    }

    .icon-container {
        margin-bottom: 0.75rem;
        background-color: var(--color-card-bg);
        padding: 0.75rem;
        border-radius: 50%;
        box-shadow: 0 2px 4px var(--color-shadow);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-card-border);
    }

    .chat-icon {
        width: 2.5rem;
        height: 2.5rem;
        color: var(--color-primary);
    }

    .empty-title {
        font-size: 1.125rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
        color: var(--color-dark-text);
    }

    .empty-subtitle {
        font-size: 0.875rem;
        color: var(--color-dark-text);
        opacity: 0.7;
    }

    .message-wrapper {
        margin-bottom: 1rem;
    }

    .user-message {
        display: flex;
        justify-content: flex-end;
    }

    .ai-message {
        display: flex;
        justify-content: flex-start;
    }

    .message {
        max-width: 80%;
        padding: 1rem;
        border-radius: 1rem;
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    .message.user {
        background-color: var(--color-primary);
        color: var(--color-text);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .message.ai {
        background-color: var(--color-card-bg);
        border: 1px solid var(--color-card-border);
        color: var(--color-dark-text);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .message.error {
        background-color: #dc3545;
        color: white;
    }

    .ai-avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: var(--color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
        border: 2px solid var(--color-text);
    }

    .ai-icon {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--color-text);
        stroke-width: 2px;
    }

    .message-text {
        flex: 1;
        word-break: break-word;
    }

    .loading-spinner {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid var(--color-text);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .input-container {
        margin-top: 1rem;
        padding: 1rem;
        background-color: var(--color-card-bg);
        border-radius: 0.5rem;
        border: 1px solid var(--color-card-border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .chat-form {
        width: 100%;
    }

    .input-wrapper {
        position: relative;
    }

    .chat-input {
        width: 100%;
        padding: 0.75rem;
        padding-right: 5rem;
        border: 1px solid var(--color-input-border);
        border-radius: 0.5rem;
        background-color: var(--color-input-bg);
        color: var(--color-input-text);
        resize: none;
        min-height: 60px;
        max-height: 120px;
    }

    .chat-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-primary);
    }

    .chat-input.error {
        border-color: #dc3545;
    }

    .input-actions {
        position: absolute;
        bottom: 0.75rem;
        right: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .char-count {
        font-size: 0.875rem;
        color: var(--color-dark-text);
        opacity: 0.7;
    }

    .char-count.error {
        color: #dc3545;
    }

    .send-button {
        background-color: var(--color-primary);
        color: var(--color-text);
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .send-button:hover:not(:disabled) {
        background-color: var(--color-secondary);
        transform: translateY(-2px);
    }

    .send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .send-icon {
        width: 1.25rem;
        height: 1.25rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    @media (max-width: 768px) {
        .chat-container {
            height: 350px;
        }

        .message {
            max-width: 90%;
        }

        .input-container {
            padding: 0.5rem;
        }

        .chat-input {
            padding: 0.5rem;
            min-height: 50px;
        }

        .input-actions {
            bottom: 0.5rem;
            right: 0.5rem;
        }
    }
</style>