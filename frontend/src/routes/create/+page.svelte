<script>
    let gameName = '';
    let error = '';

    async function handleCreateGame() {
        try {
            const adminId = localStorage.getItem('userId');
            const response = await fetch('http://localhost:4840/api/games', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: gameName, admin_id: adminId})
            });

            if(!response.ok) {
                const {error} = await response.json()
                throw new Error(error)
            }

            window.location.href = '/dashboard';
        } catch (err) {
            error = err.message
        }
    }
</script>

<h1>Create a New Game</h1>
<form on:submit|preventDefault={handleCreateGame}>
    <input type="text" bind:value={gameName} placeholder="Game Name" required />
    <button type="submit">Create Game</button>
</form>
<p>{error}</p>