const apiBaseUrl = 'http://localhost:5049'; // Change this to your API base URL

var mymap;

document.addEventListener('DOMContentLoaded', function () {
    mymap = L.map('mapid').setView([45.815, 15.9819], 13); // Set view to Zagreb

    // Leaflet tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    // Array to store current interventions
    var interventions = [];

    // Initialize allFirefighters as an empty array
    var allFirefighters = [];

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

            allFirefighters = [...activeFirefighters, ...inactiveFirefighters]; // Update global variable
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

            // Populating list below the map
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

    // Function to fetch intervention types from your API and populate dropdown
    async function fetchInterventionTypes() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }

            let response = await fetch(`${apiBaseUrl}/api/Intervention/FetchInterventionTypes`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for FetchInterventionTypes ' + response.statusText);
            }

            let typesData = await response.json();
            console.log('Fetched intervention types:', typesData);

            var interventionTypeSelect = document.getElementById('interventionType');
            interventionTypeSelect.innerHTML = ''; // Clear existing options
            typesData.$values.forEach(type => {
                var option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                interventionTypeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('There was a problem with fetching intervention types:', error);
        }
    }

    async function fetchNotifications(includeActiven ,includeInactive) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${apiBaseUrl}/api/Intervention/FetchUserIntervention?includeActive=true&includeInactive=false`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ includeActive:true, includeInactive:true })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for FetchUserIntervention ' + response.statusText);
            }

            let interventions = await response.json();
            console.log('Fetched user interventions:', interventions);
            //displayNotifications(interventions);
            return interventions;
        } catch (error) {
            console.error('There was a problem with fetching user interventions:', error);
            return null;
        }
    }

    async function fetchAddress(latlng) {
        try {
            let response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`);
            if (!response.ok) {
                throw new Error('Failed to fetch address.');
            }
            let data = await response.json();
            return data.display_name;
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Address not available';
        }
    }

    function displayNotifications(notifications) {
        var notificationsContainer = document.getElementById('showNotificationBtn');
        notificationsContainer.innerHTML = ''; // Clear existing notifications

        notifications.forEach(async notification => {
            var notificationElement = document.createElement('div');
            notificationElement.className = 'notification';
            notificationElement.innerHTML = `
                <p>${notification.message} - ${notification.streetName}</p>
                <button class="accept-btn" data-id="${notification.id}">Accept</button>
                <button class="decline-btn" data-id="${notification.id}">Decline</button>
            `;

            // Fetch and display address
            let address = await fetchAddress(notification.latlng);
            notificationElement.innerHTML += `<p>Address: ${address}</p>`;

            notificationsContainer.appendChild(notificationElement);
        });

        // Add event listeners for accept and decline buttons (if not already added)
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

            let response = await fetch(`${apiBaseUrl}/api/Intervention/HandleNotificationResponse`, {
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

    function openAddInterventionModal(latlng) {
        var modal = document.getElementById("addInterventionModal");
        modal.style.display = "block";

        var span = modal.querySelector(".close");
        span.onclick = function () {
            modal.style.display = "none";
        };

        var addBtn = document.getElementById("addInterventionBtn");
        addBtn.onclick = function () {
            var firefighterSelect = document.getElementById("firefighter");
            var selectedOptions = Array.from(firefighterSelect.selectedOptions);
            var selectedFirefighterIds = selectedOptions.map(option => option.value);
            var selectedFirefighterRankIds = selectedOptions.map(option => option.dataset.rankId);
            var interventionType = document.getElementById("interventionType").value;

            if (selectedFirefighterRankIds.includes('1')) {
                alert("Cannot select the commander (rank 1) for an intervention.");
                return;
            }

            selectedFirefighterIds.forEach(firefighterId => {
                var firefighter = allFirefighters.find(f => f.id === firefighterId);
                if (firefighter) {
                    var marker = L.marker(latlng).addTo(mymap);
                    marker.bindPopup(`Firefighter: ${firefighter.name}<br>Intervention Type: ${interventionType}`).openPopup();
                    interventions.push({
                        id: firefighterId,
                        type: interventionType,
                        latlng: latlng
                    });
                }
            });

            modal.style.display = "none";
        };
    }

    async function fetchCurrentUser() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${apiBaseUrl}/api/User/FetchPersonalData?includeAdditionalData=true`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for CurrentUser ' + response.statusText);
            }

            let currentUser = await response.json();
            return currentUser;
        } catch (error) {
            console.error('There was a problem with fetching the current user:', error);
            return null;
        }
    }

    async function initializeMapAndInterventions() {
        const currentUser = await fetchCurrentUser();
        if (currentUser && currentUser.rankId === 1) { // Assuming rankId 1 is for the commander
            mymap.on('dblclick', function (e) {
                openAddInterventionModal(e.latlng);
            });
        } else {
            // Remove any existing event listeners to ensure only commander can create interventions
            mymap.off('dblclick');
        }

        // Fetch existing interventions if any (this could be based on your API logic)
        fetchNotifications();
    }

    var showNotificationBtn = document.getElementById("showNotificationBtn");
    showNotificationBtn.onclick = function () {
        if (interventions.length > 0) {
            let lastIntervention = interventions[interventions.length - 1];
            alert(`Current Intervention:\nAddress: ${lastIntervention.latlng.lat}, ${lastIntervention.latlng.lng}\nType: ${lastIntervention.type}`);
        } else {
            alert("No current interventions on the map.");
        }
    }

    fetchAndPopulateFirefighters();
    fetchInterventionTypes();
    initializeMapAndInterventions();
});
