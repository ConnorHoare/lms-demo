<script>
	import { jwtDecode } from "jwt-decode";

	let identifier = '';
	let password = '';
	let err = '';

	async function handleLogin() {
		try {
			const response = await fetch('http://localhost:4840/api/users/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ identifier, password })
			});

			if (!response.ok) {
				const { error } = await response.json();
				console.log('Logging error: ', error);
				throw new Error(error);
			}

			const { token } = await response.json();

            // Decode the token payload
            const decoded = jwtDecode(token);

            // Check the decoded payload for the user ID
            if (decoded && decoded.id) {
                localStorage.setItem('userId', decoded.id);
            } else {
                throw new Error('User ID not found in token payload');
            }

            localStorage.setItem('token', token);

			window.location.href = '/dashboard';
		} catch (error) {
			// @ts-ignore
			err = error.message;
		}
	}
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
	<input type="text" bind:value={identifier} placeholder="Email or password" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<button type="submit">Login</button>
</form>
<p>{err}</p>
