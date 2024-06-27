class Comms {
    static apiBaseUrl = 'http://localhost:5049';
    static dothingy(){
        Comms.apiBaseUrl
    }

    static async fetchUserInterventions(includeActive, includeInactive) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/FetchUserIntervention?includeActive=${includeActive}&includeInactive=${includeInactive}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ includeActive, includeInactive })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for FetchUserIntervention ' + response.statusText);
            }

            let interventions = await response.json();
            console.log('Fetched user interventions:', interventions);
            return interventions;
        } catch (error) {
            console.error('There was a problem with fetching user interventions:', error);
            return null;
        }
    }

    static async fetchCommanderInterventions(includeActive, includeInactive) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/FetchCommanderInterventions?includeActive=${includeActive}&includeInactive=${includeInactive}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ includeActive, includeInactive })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for FetchCommanderInterventions ' + response.statusText);
            }

            let interventions = await response.json();
            console.log('Fetched commander interventions:', interventions);
            return interventions;
        } catch (error) {
            console.error('There was a problem with fetching commander interventions:', error);
            return null;
        }
    }

    static async fetchInterventionTypes() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/FetchInterventionTypes`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for FetchInterventionTypes ' + response.statusText);
            }

            let interventionTypes = await response.json();
            console.log('Fetched intervention types:', interventionTypes);
            return interventionTypes;
        } catch (error) {
            console.error('There was a problem with fetching intervention types:', error);
            return null;
        }
    }

    static async removeIntervention(interventionId) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/RemoveIntervention?interventionID=${interventionId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interventionId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for RemoveIntervention ' + response.statusText);
            }

            console.log('Removed intervention:', interventionId);
            return true;
        } catch (error) {
            console.error('There was a problem with removing the intervention:', error);
            return false;
        }
    }

    static async recoverIntervention(interventionId) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/RecoverIntervention?interventionID=${interventionId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interventionId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for RecoverIntervention ' + response.statusText);
            }

            console.log('Recovered intervention:', interventionId);
            return true;
        } catch (error) {
            console.error('There was a problem with recovering the intervention:', error);
            return false;
        }
    }

    static async setInterventionState(interventionId, state) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/SetInterventionState?interventionID=${interventionId}&active=${state}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interventionId, state })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for SetInterventionState ' + response.statusText);
            }

            console.log('Set intervention state:', interventionId, state);
            return true;
        } catch (error) {
            console.error('There was a problem with setting the intervention state:', error);
            return false;
        }
    }

    static async createIntervention() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/CreateIntervention`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for CreateIntervention ' + response.statusText);
            }

            let newIntervention = await response.json();
            console.log('Created new intervention:', newIntervention);
            return newIntervention;
        } catch (error) {
            console.error('There was a problem with creating the intervention:', error);
            return null;
        }
    }

    static async fetchInterventionCommander(interventionId) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/FetchInterventionCommander?InterventionID=${interventionId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interventionId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for fetch intervention commander ' + response.statusText);
            }

            console.log('Commander:', interventionId);
            return true;
        } catch (error) {
            console.error('There was a problem with recovering the intervention commander:', error);
            return false;
        }
    }

    static async fetchInterventionParticipants(interventionId) {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return null;
            }

            let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/FetchInterventionParticipants?InterventionID=${interventionId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ interventionId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok for fetch intervention participants ' + response.statusText);
            }

            console.log('Participants:', interventionId);
            return true;
        } catch (error) {
            console.error('There was a problem with recovering the intervention participants:', error);
            return false;
        }
    }

}
async function fetchRanks() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            return null;
        }

        let response = await fetch(`${Comms.apiBaseUrl}/api/User/FetchRanks`, {
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

async function fetchAndPopulateFirefighters(includeActive,includeActive) {
  
    
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

        let response = await fetch(`${Comms.apiBaseUrl}/api/User/FetchCommanderFirefighters?includeActive=${includeActive}&includeInactive${includeInactive}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok for FetchCommanderFirefighters ' + response.statusText);
        }
        return response;
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

async function FetchPersonalData(additionalData){
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            return null;
        }

        let response = await fetch(`${Comms.apiBaseUrl}/api/User/FetchPersonalData?includeAdditionalData=${additionalData}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ additionalData })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok for Fetch of personal data ' + response.statusText);
        }

        let interventions = await response.json();
        console.log('Fetched personal data:', interventions);
        return interventions;
    } catch (error) {
        console.error('There was a problem with fetching personal data:', error);
        return null;
    }
}

async function AcceptInterventionInvitation(interventionId){
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            return null;
        }

        let response = await fetch(`${Comms.apiBaseUrl}/api/Intervention/AcceptIntervention?interventionID=${interventionId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ interventionId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok for accepting intervention ' + response.statusText);
        }

        console.log('Participants:', interventionId);
        return true;
    } catch (error) {
        console.error('There was a problem with recovering the intervention:', error);
        return false;
    }

}



async function DeclineInterventionInvitation(interventionId){
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            return null;
        }

        let response = await fetch(`${Comms.apiBaseUrl}/api/Invitation/DeclineIntervnetionInvitation?interventionID=${interventionId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ interventionId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok for declining intervention ' + response.statusText);
        }

        console.log('Participants:', interventionId);
        return true;
    } catch (error) {
        console.error('There was a problem with recovering the intervention:', error);
        return false;
    }

}
async function InviteFireFighterToInvitation(interventionId,firefighterId){
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No authentication token found. Please log in.');
            return null;
        }

        let response = await fetch(`${Comms.apiBaseUrl}/api/Invitation/InviteFirefighterToIntervention?interventionID=${interventionId}&firefighterId=${firefighterId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ interventionId,firefighterId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok for invite ' + response.statusText);
        }

        console.log('Participants:', interventionId);
        return true;
    } catch (error) {
        console.error('There was a problem with  the intervention:', error);
        return false;
    }
}







