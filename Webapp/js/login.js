const apiBaseUrl = 'http://localhost:5049'; // Change this to your API base URL

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorMessage = document.getElementById('error-message');
    
   /* function encodePassword(password) {
        return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
}*/
//not used





    // Clear any previous error message
    errorMessage.textContent = '';
   
    // Check if username and password are entered
    if (!username || !password) {
        errorMessage.textContent = 'Please enter both username and password';
        return;
    }   


   // const encodedPassword = encodePassword(password);

   
   $.ajax({
    url: apiBaseUrl + "/api/User/LogIn",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ "username": username, "password": password })
    })
        .done(function(data, textStatus, jqXHR){
            console.log(data);
            if (true) {
            localStorage.setItem('token', data);
            alert('Logged in successfully!');
            console.log(data);
            window.location.href = "index.html";
            }
            else{
                $(data.errorMessages).each(function(){
                    errorMessage.textContent = 'Login failed';
                });
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
            errorMessage.textContent = 'Connection failed';
        })
        .always(function(data_OR_jqXHR, textStatus, jqXHR_OR_errorThrown){
    });
    
    return;
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
        console.log(data.token);
        window.location.replace("index.html");
        
    } else {
        errorMessage.textContent = 'Login failed';
    }


    
}
