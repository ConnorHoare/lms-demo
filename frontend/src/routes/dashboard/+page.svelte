<script>
    import { onMount } from 'svelte';

    let games = [];
    let allGames = [];
    let error = '';
    let joiningError = '';

    async function joinGame(game_id) {
        try {
            const user_id = localStorage.getItem('userId');
            const response = await fetch('http://localhost:4840/api/players', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id, game_id})
            });

            if(!response.ok) {
                const {error} = await response.json()
                throw new Error(error)
            }

           fetchGames() 
        } catch (error) {
            joiningError = error.message || "Failed to join the game";
        }
    }

    async function fetchGames() {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`http://localhost:4840/api/games/user/${userId}`);
            if(!response.ok) throw new Error('Failed to fetch games.');
            games = await response.json();
            console.log(games)
        } catch (err) {
            error = err.message || "An error occured while fetching games"
        }
    }

    async function fetchAllGames() {
        try {
            const response = await fetch('http://localhost:4840/api/games');
            if (!response.ok) throw new Error("Failed to fetch all games.");
            allGames = await response.json()
        } catch (err) {
            error = err.message;
        }
    }

    onMount(async () => {
        // Check for a logged-in user
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token is found
            window.location.href = '/auth/login';
            return; // Prevent further execution
        }

        // Fetch games data (only runs if token exists)
        try {
            const userId = localStorage.getItem('userId'); 
            const response = await fetch(`http://localhost:4840/api/games/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }, // Pass token if needed
            });

            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }

            games = await response.json();
        } catch (err) {
            error = err.message || 'An error occurred while fetching games';
        }
        fetchGames();
        fetchAllGames();
    });
</script>

<h1>Your Games</h1>
{#if error}
    <p>{error}</p>
{:else if games.length === 0}
    <p>You haven't joined any games yet.</p>
{:else}
<ul>
    {#each games as game}
        <li>
            <span>{game.games.name} - {game.games.status}</span>
            <a href={`/game/${game.game_id}`}>Go to game</a>
        </li>
    {/each}
</ul>
{/if}

<ul>
    {#each allGames as game}
        <li>
            <span>{game.name} - {game.status}</span>
            <button on:click={() => joinGame(game.id)}>Join Game</button>
        </li>
    {/each}
</ul>

<a href="/create">
    <button>Create New Game</button>
</a>
