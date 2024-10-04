import React from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const { token, role } = data;
          // Stocker le token et le rôle (exemple : localStorage)
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          // Rediriger ou afficher un message de succès
          console.log('Login successful!', token, role);
        } else {
          setErrorMessage('Invalid credentials');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setErrorMessage('Something went wrong, please try again later.');
      }
    };
    return (
      <div>
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

export default Login;
