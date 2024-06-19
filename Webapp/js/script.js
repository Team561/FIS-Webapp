// script.js

const apiBaseUrl = 'http://localhost:5049'; // Change this to your API base URL

document.addEventListener('DOMContentLoaded', function () {
    var mymap = L.map('mapid').setView([45.815, 15.9819], 13); // Set view to Zagreb

    // Leaflet tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    // Function to fetch ranks from your API
    async function fetchRanks() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${apiBaseUrl}/api/User/FetchRanks`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for FetchRanks ' + response.statusText);
            }

            let ranksData = await response.json();
            console.log('Fetched ranks:', ranksData);

            let ranksMap = ranksData.$values.reduce((acc, rank) => {
                acc[rank.idRank] = rank.name;
                return acc;
            }, {});

            console.log('Ranks map:', ranksMap);
            return ranksMap;
        } catch (error) {
            console.error('There was a problem with fetching ranks:', error);
            return null;
        }
    }

    // Function to fetch firefighters from your API and populate dropdown
    async function fetchAndPopulateFirefighters() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }

            const ranksMap = await fetchRanks();
            if (!ranksMap) {
                console.error('Ranks map could not be created.');
                return;
            }

            let response = await fetch(`${apiBaseUrl}/api/User/FetchCommanderFirefighters?includeActive=true`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ includeAdditionalData: true })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for FetchCommanderFirefighters ' + response.statusText);
            }

            let responseData = await response.json();
            console.log('Fetched firefighters data:', responseData);

            let activeFirefighters = responseData.activeFirefighters.$values;
            let inactiveFirefighters = responseData.inactiveFirefighters.$values;

            let allFirefighters = [...activeFirefighters, ...inactiveFirefighters];
            console.log('All firefighters:', allFirefighters);

            var firefighterSelect = document.getElementById('firefighter');
            firefighterSelect.innerHTML = ''; // Clear existing options
            allFirefighters.forEach(firefighter => {
                console.log('Firefighter:', firefighter);
                var option = document.createElement('option');
                option.value = firefighter.id;
                let rankName = ranksMap[firefighter.rankId] || 'Unknown Rank';
                option.textContent = `${firefighter.name} (Rank: ${rankName})`;
                option.dataset.rankId = firefighter.rankId;
                firefighterSelect.appendChild(option);
            });
        } catch (error) {
            console.error('There was a problem with fetching and populating firefighters:', error);
        }
    }

    fetchAndPopulateFirefighters();

    function openAddInterventionModal(latlng) {
        var modal = document.getElementById("addInterventionModal");
        modal.style.display = "block";

        var span = modal.querySelector(".close");
        span.onclick = function () {
            modal.style.display = "none";
        }

        var addBtn = document.getElementById("addInterventionBtn");
        addBtn.onclick = function () {
            var firefighterSelect = document.getElementById("firefighter");
            var firefighterId = firefighterSelect.value;
            var firefighterRankId = firefighterSelect.options[firefighterSelect.selectedIndex].dataset.rankId;
            var interventionType = document.getElementById("interventionType").value;

            if (firefighterRankId === '1') {
                alert("Cannot select the commander (rank 1) for an intervention.");
                return;
            }

            var marker = L.marker(latlng).addTo(mymap).bindPopup(`Firefighter ID: ${firefighterId}<br>Intervention Type: ${interventionType}<br>Rank ID: ${firefighterRankId}`);
            modal.style.display = "none";
        }
    }

    mymap.on('dblclick', function (e) {
        openAddInterventionModal(e.latlng);
    });

    var showNotificationBtn = document.getElementById("showNotificationBtn");
    showNotificationBtn.onclick = function () {
        alert("Notification shown!");
    }
});
