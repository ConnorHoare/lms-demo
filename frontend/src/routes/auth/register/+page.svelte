<script>
	import { supabase } from '$lib/supabase';
	let email = '';
	let password = '';
	let err = '';

	async function handleRegister() {
		const { error } = await supabase.auth.signUp({ email, password });
		if (error) {
			err = error.message;
		} else {
			window.location.href = '/dashboard';
		}
	}
</script>

<h1>Register</h1>
<form on:submit|preventDefault={handleRegister}>
	<input type="email" placeholder="Email" required />
	<input type="password" placeholder="Password" required />
	<button type="submit">Register</button>
</form>
<p>{err}</p>
