const apiBaseUrl = 'http://localhost:5049'; // Change this to your API base URL

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('error-message');

    // Clear any previous error message
    errorMessage.textContent = '';

    // Check if username and password are entered
    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password';
        return;
    }
   
   $.ajax({
    url: apiBaseUrl + "/api/User/LogIn",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ "username": username, "password": password })
    })
        .done(function(data, textStatus, jqXHR){
            localStorage.setItem('authToken', data);
            alert('Logged in successfully!');
            console.log(data);
            window.location.href = "index.html";
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
            errorMessage.textContent = 'Connection failed';
        })
        .always(function(data_OR_jqXHR, textStatus, jqXHR_OR_errorThrown){
    });
    
    return;
}
