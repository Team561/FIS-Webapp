function logout() {
    if (localStorage.getItem("authToken") != null) {
        localStorage.clear();
        $("#loginbutton").html("Login");
        $("#loginbutton").attr("href","login.html");
        window.location.replace("home.html");
    }
    else {
        video.setAttribute("class", "videonoblur");
    }
}


$(window).ready(function () { //on load function

    if (localStorage.getItem("authToken") != null) { 

        console.log("token in use, logged in status");

        if($(".threedash").css("display") != "block") { 
            $("#curriculum").css("display","block"); 
        }

        $("#loginbutton").html("Logout"); 
        $("#loginbutton").attr("href","javascript:logout()"); 
        console.log(window.location.href);

    }
    else {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        console.log( page );
        if (page != "home.html") {
            window.location.replace("home.html");
        }
    }
})