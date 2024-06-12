const apiBaseUrl = 'http://localhost:5000'; // Change this to your API base URL

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('error-message');
    
   /* function encodePassword(password) {
        return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}*/





    // Clear any previous error message
    errorMessage.textContent = '';
   
    // Check if username and password are entered
    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password';
        return;
    }   


    const encodedPassword = encodePassword(password);

    
    // Proceed with the login request
    const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Logged in successfully!');
    } else {
        errorMessage.textContent = 'Login failed';
    }
    
}
