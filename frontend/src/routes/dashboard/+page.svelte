<script>
     import { onMount } from 'svelte';

     onMount(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token is found
            window.location.href = '/auth/login';
        }
    });

    function handleLogout() {
        // Remove the token from local storage
        localStorage.removeItem('token');
        
        // Redirect to the login page
        window.location.href = '/auth/login';
    }
</script>

<h1>Welcome to the Dashboard</h1>
<button on:click={handleLogout}>Log Out</button>