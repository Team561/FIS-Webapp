const apiBaseUrl = 'http://localhost:5049'; // Change this to your API base URL

document.addEventListener('DOMContentLoaded', function () {
    var mymap = L.map('mapid').setView([45.815, 15.9819], 13); // Set view to Zagreb

    // Leaflet tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    // Array to store current interventions
    var interventions = [];

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

            //populating list below the map
            var firefighterList = document.getElementById('firefighterList');
            firefighterList.innerHTML = ''; // Clear existing list
            allFirefighters.forEach(firefighter => {
                var listItem = document.createElement('li');
                let rankName = ranksMap[firefighter.rankId] || 'Unknown Rank';
                listItem.textContent = `${firefighter.name} (Rank: ${rankName})`;
                firefighterList.appendChild(listItem);
            });

            
            // Check firefighter ID and set map visibility
            allFirefighters.forEach(firefighter => {
                if (firefighter.id === 2 || firefighter.id === 3 || firefighter.id === 4) {
                    document.getElementById('mapid').style.display = 'none';
                }
            });
            
        } catch (error) {
            console.error('There was a problem with fetching and populating firefighters:', error);
        }
    }
    
    async function fetchNotifications() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }

            let response = await fetch(`${apiBaseUrl}/api/Invitation/FetchUserInvitations`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for FetchNotifications ' + response.statusText);
            }

            let notifications = await response.json();
            displayNotifications(notifications);
        } catch (error) {
            console.error('There was a problem with fetching notifications:', error);
        }
    }

    function displayNotifications(notifications) {
        var notificationsContainer = document.getElementById('showNotificationBtn');
        notificationsContainer.innerHTML = ''; // Clear existing notifications

        notifications.forEach(notification => {
            var notificationElement = document.createElement('div');
            notificationElement.className = 'notification';
            notificationElement.innerHTML = `
                <p>${notification.message} - ${notification.streetName}</p>
                <button class="accept-btn" data-id="${notification.id}">Accept</button>
                <button class="decline-btn" data-id="${notification.id}">Decline</button>
            `;
            notificationsContainer.appendChild(notificationElement);
        });

        // Add event listeners for accept and decline buttons
        document.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', function () {
                handleNotificationResponse(this.dataset.id, true);
            });
        });

        document.querySelectorAll('.decline-btn').forEach(button => {
            button.addEventListener('click', function () {
                handleNotificationResponse(this.dataset.id, false);
            });
        });
    }

    async function handleNotificationResponse(notificationId, isAccepted) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }

            let response = await fetch(`${apiBaseUrl}/api/Notifications/Respond`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationId, isAccepted })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for HandleNotificationResponse ' + response.statusText);
            }

            // Refetch notifications after response
            fetchNotifications();
        } catch (error) {
            console.error('There was a problem with handling notification response:', error);
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
            interventions.push({
                id: firefighterId,
                type: interventionType,
                latlng: latlng
            });
            modal.style.display = "none";
        }
    }

    mymap.on('dblclick', function (e) {
        openAddInterventionModal(e.latlng);
    });

    var showNotificationBtn = document.getElementById("showNotificationBtn");
    showNotificationBtn.onclick = function () {
        if (interventions.length > 0) {
            let lastIntervention = interventions[interventions.length - 1];
            alert(`Current Intervention:\nAddress: ${lastIntervention.latlng.lat}, ${lastIntervention.latlng.lng}\nType: ${lastIntervention.type}`);
        } else {
            alert("No current interventions on the map.");
        }
    }
});

class Refresh{
    static funcsToCall = [];

    static subscribeToRefreshTimer(func){
        Refresh.funcsToCall.push(func);
    }
    
    static triggerRefreshFunctions(){
        Refresh.funcsToCall.forEach(function(func){
            func();
        });
        Refresh.triggerNewTimer();
    }

    static triggerNewTimer(){
        setTimeout(Refresh.triggerRefreshFunctions, 200);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    Refresh.triggerNewTimer();
    Refresh.subscribeToRefreshTimer(function(){
        console.log("PULSE");
    })
});
