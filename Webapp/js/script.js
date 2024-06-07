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
});
