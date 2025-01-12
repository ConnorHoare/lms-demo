<script>
    import {supabase} from '$lib/supabase'
    let email = ''
    let password = ''
    let err = ''

    async function handleLogin() {
        const {error} = await supabase.auth.signInWithPassword({email, password});
        if(error) {
            err = error.message;
        } else {
            window.location.href = '/daashboard'
        }
    }
</script>

<h1>Login</h1>
<form on:submit|preventDefault={handleLogin}>
    <input type="email" bind:value={email} placeholder="Email" required/>
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Login</button>
</form>
<p>{err}</p>