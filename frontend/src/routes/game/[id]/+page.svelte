<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let game = null;
    let participants = [];
    let rounds = [];
    let error = '';

    const game_id = $page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`http://localhost:4840/api/games/${game_id}/details`);
            if (!response.ok) throw new Error('Failed to fetch game details');

            const data = await response.json();
            game = data.game;
            participants = data.participants;
            rounds = data.rounds;
        } catch (err) {
            error = err.message || 'An error occurred';
        }
    });
</script>

<h1>Game Details</h1>
{#if error}
    <p>{error}</p>
{:else if !game}
    <p>Loading game details...</p>
{:else}
    <div>
        <h2>{game.name}</h2>
        <p>Status: {game.status}</p>

        <h3>Participants</h3>
        <ul>
            {#each participants as participant}
                <li>{participant.users.username} ({participant.users.email})</li>
            {/each}
        </ul>

        <h3>Rounds</h3>
        {#if rounds.length === 0}
            <p>No rounds available yet.</p>
        {:else}
            <ul>
                {#each rounds as round}
                    <li>Round {round.id}: {round.status}</li>
                {/each}
            </ul>
        {/if}
    </div>
{/if}
