<script lang="ts">
    import '../app.css';
    import Navbar from '$lib/components/navbar.svelte';
    import { slide, fade } from 'svelte/transition';
    export let data;

    interface ChatMessage {
        type: 'user' | 'assistant' | 'error';
        content: string;
        timestamp: Date;
    }

    let showChatbot = false;
    let userQuestion = '';
    let isLoading = false;
    let isExpanded = false;
    let chatHistory: ChatMessage[] = [];

    // Updated Queries based on your new system
    const suggestedQueries = [ 
        {
            query: "Summarize all attendance records",
            endpoint: "attendance_summary"
        },
        {
            query: "How many students were absent today?",
            endpoint: "absent_today"
        },
        {
            query: "Generate academic performance summary",
            endpoint: "academic_summary"
        },
        {
            query: "Show top-performing students",
            endpoint: "top_students"
        }
    ];

    async function getAIResponse() {
        if (!userQuestion.trim()) return;
        
        const question = userQuestion;
        userQuestion = '';
        isLoading = true;
        
        chatHistory = [...chatHistory, { 
            type: 'user', 
            content: question,
            timestamp: new Date()
        }];

        try {
            const matchedQuery = suggestedQueries.find(q =>
                q.query.toLowerCase() === question.toLowerCase()
            );

            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: question,
                    type: matchedQuery?.endpoint || 'custom'
                })
            });

            if (!response.ok) throw new Error('Server error');

            const data = await response.json();

            const cleanResponse = data.response
                ?.replace(/<think>[\s\S]*?<\/think>/g, '')
                .replace(/\[.*?\]/g, '')
                .replace(/##\s*(.*?)\s*##/g, '### $1')
                .replace(/\*\*\s*(.*?)\s*\*\*/g, '**$1**')
                .trim()
                .split('###')
                .map(section => section.trim())
                .filter(Boolean)
                .join('\n\n### ');

            chatHistory = [...chatHistory, {
                type: 'assistant',
                content: cleanResponse || 'No response generated.',
                timestamp: new Date()
            }];
        } catch (error) {
            chatHistory = [...chatHistory, {
                type: 'error',
                content: '⚠️ There was a problem processing your request.',
                timestamp: new Date()
            }];
        } finally {
            isLoading = false;
        }
    }

    function formatMessage(content: string): string {
        return content
            .replace(/###\s*(.*?)(?=\n|$)/g, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    function toggleExpand() {
        isExpanded = !isExpanded;
    }

    function formatTimestamp(date: Date): string {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    }

    function selectSuggestedQuery(query: string) {
        userQuestion = query;
        getAIResponse();
    }

    // New function to handle user input
    function handleUserInput(event: Event) {
        event.preventDefault();
        getAIResponse();
    }
</script>

<!-- Layout -->
<div class="layout">
    <Navbar activePage={data?.activePage || ''} />

    <main class="main-content">
        <div class="container">
            <slot />
        </div>
    </main>

    <!-- Toggle Button -->
    <div class="ai-assistant-toggle">
        <button class="btn btn-primary rounded-full" on:click={() => showChatbot = !showChatbot}>
            <i class="fas {showChatbot ? 'fa-times' : 'fa-robot'}"></i>
        </button>
    </div>

    <!-- Chatbot Panel -->
    {#if showChatbot}
        <div class="ai-panel {isExpanded ? 'expanded' : ''}" transition:slide>
            <div class="ai-panel-header">
                <div class="flex items-center gap-2">
                    <i class="fas fa-robot text-primary-color"></i>
                    <h3 class="text-lg font-bold">AI Assistant</h3>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-icon" on:click={toggleExpand}>
                        <i class="fas {isExpanded ? 'fa-compress-alt' : 'fa-expand-alt'}"></i>
                    </button>
                    <button class="btn btn-icon" on:click={() => showChatbot = false}>
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Chat Area -->
            <div class="ai-panel-body">
                <div class="ai-chat" id="chat-container">
                    {#if chatHistory.length === 0}
                        <div class="ai-welcome" transition:fade>
                            <i class="fas fa-robot text-4xl mb-4 text-primary-color"></i>
                            <h4 class="text-lg font-semibold mb-2">Hello! 👋</h4>
                            <p class="text-text-secondary mb-4">I'm here to help with student insights, attendance data, and more.</p>

                            <div class="suggested-queries">
                                <h5 class="text-sm font-semibold mb-2">Try one of these:</h5>
                                {#each suggestedQueries as { query }}
                                    <button class="suggested-query" on:click={() => selectSuggestedQuery(query)}>
                                        <i class="fas fa-search"></i>
                                        {query}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Chat History -->
                    {#each chatHistory as message}
                        <div class="message {message.type}" transition:fade>
                            <div class="message-content">
                                <i class="fas {message.type === 'assistant' ? 'fa-robot' : message.type === 'user' ? 'fa-user' : 'fa-exclamation-triangle'} message-icon"></i>
                                <div class="message-text">
                                    {@html formatMessage(message.content)}
                                </div>
                            </div>
                            <div class="message-timestamp">
                                {formatTimestamp(message.timestamp)}
                            </div>
                        </div>
                    {/each}

                    {#if isLoading}
                        <div class="message assistant" transition:fade>
                            <div class="message-content">
                                <i class="fas fa-robot message-icon"></i>
                                <div class="thinking">
                                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Input -->
                <div class="ai-input">
                    <form on:submit|preventDefault={getAIResponse} class="flex gap-2">
                        <input
                            type="text"
                            bind:value={userQuestion}
                            placeholder="Ask about attendance, summaries..."
                            class="form-input flex-1"
                            disabled={isLoading}
                        />
                        <button type="submit" class="btn btn-primary" disabled={isLoading}>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    {/if}
</div>
