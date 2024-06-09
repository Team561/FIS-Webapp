document.addEventListener("DOMContentLoaded", function() {
    // Set the view to Zagreb, Croatia with latitude and longitude
    var map = L.map('mapid').setView([45.8150, 15.9819], 13);

    // Use OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker to a specific location in Zagreb
    L.marker([45.8150, 15.9819]).addTo(map)
        .bindPopup('Zagreb, Croatia<br> Capital City.')
        .openPopup();

    // Define locations where you want to add additional markers
    var locations = [
        { lat: 45.812, lng: 15.975, popup: "Marker 1: Location 1" },
        { lat: 45.820, lng: 15.990, popup: "Marker 2: Location 2" },
        { lat: 45.817, lng: 15.985, popup: "Marker 3: Location 3" }
    ];

    // Loop through the locations and add a marker for each one
    locations.forEach(function(location) {
        L.marker([location.lat, location.lng])
            .addTo(map)
            .bindPopup(location.popup);
    });

    // Example function to show a notification when a button is clicked
    document.getElementById('showNotificationBtn').addEventListener('click', function() {
        alert('Notification: This is an example notification.');
    });
});
