<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/dark/theme';
	import { onMount } from 'svelte';
	
	let { children } = $props();

	onMount(() => {
		// Initialize theme
		document.documentElement.setAttribute('data-theme', $theme);
	});
</script>

{@render children()}
