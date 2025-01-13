<script>
	let email = '';
	let password = '';
	let username = '';
	let err = '';

	async function handleRegister() {
		try {
			const response = await fetch('http://localhost:4840/api/users/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, username })
			});

			if (!response.ok) {
				const { error } = await response.json();
                throw new Error(error);
			}

            window.location.href = '/dashboard';
		} catch (error) {
			error = err;
		}
	}
</script>

<h1>Register</h1>
<form on:submit|preventDefault={handleRegister}>
	<input type="email" placeholder="Email" bind:value={email} required />
	<input type="text" placeholder="Usernmae" bind:value={username} required />
	<input type="password" placeholder="Password" bind:value={password} required />
	<button type="submit">Register</button>
</form>
<p>{err}</p>
