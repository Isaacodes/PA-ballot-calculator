function formatNumberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeCommas(str) {
    return parseInt(str.replace(/,/g, '')) || 0;
}

function calculateTotalBallotRequests() {
    const rBallotRequests = parseInt(document.getElementById("rBallotRequests").value);
    const dBallotRequests = parseInt(document.getElementById("dBallotRequests").value);
    const oBallotRequests = parseInt(document.getElementById("oBallotRequests").value);

    document.getElementById("rBallotRequestsOutput").textContent = formatNumberWithCommas(rBallotRequests);
    document.getElementById("dBallotRequestsOutput").textContent = formatNumberWithCommas(dBallotRequests);
    document.getElementById("oBallotRequestsOutput").textContent = formatNumberWithCommas(oBallotRequests);

    const totalBallotRequests = rBallotRequests + dBallotRequests + oBallotRequests;
    document.getElementById("totalBallotRequests").textContent = formatNumberWithCommas(totalBallotRequests);

    calculateReturnedBallots();
}

function calculateReturnedBallots() {
    const rBallotRequests = parseInt(document.getElementById("rBallotRequests").value);
    const dBallotRequests = parseInt(document.getElementById("dBallotRequests").value);
    const oBallotRequests = parseInt(document.getElementById("oBallotRequests").value);

    const rReturnRate = parseFloat(document.getElementById("rReturnRate").value) / 100;
    const dReturnRate = parseFloat(document.getElementById("dReturnRate").value) / 100;
    const oReturnRate = parseFloat(document.getElementById("oReturnRate").value) / 100;

    // Update the percentage outputs with 1 decimal place
    document.getElementById("rReturnRateOutput").textContent = `${(rReturnRate * 100).toFixed(1)}%`;
    document.getElementById("dReturnRateOutput").textContent = `${(dReturnRate * 100).toFixed(1)}%`;
    document.getElementById("oReturnRateOutput").textContent = `${(oReturnRate * 100).toFixed(1)}%`;

    // Calculate returned ballots
    const rReturned = Math.round(rBallotRequests * rReturnRate);
    const dReturned = Math.round(dBallotRequests * dReturnRate);
    const oReturned = Math.round(oBallotRequests * oReturnRate);

    // Display individual party's returned ballots
    document.getElementById("rReturnedOutput").textContent = formatNumberWithCommas(rReturned);
    document.getElementById("dReturnedOutput").textContent = formatNumberWithCommas(dReturned);
    document.getElementById("oReturnedOutput").textContent = formatNumberWithCommas(oReturned);

    // Calculate and display total returned ballots
    const totalReturnedBallots = rReturned + dReturned + oReturned;
    document.getElementById("totalReturnedBallots").textContent = formatNumberWithCommas(totalReturnedBallots);

    calculateVoteBreakdown(rReturned, dReturned, oReturned);
}


function calculateVoteBreakdown(rReturned = 0, dReturned = 0, oReturned = 0) {
    const rVoteSliderValue = parseInt(document.getElementById("rVoteBreakdown").value);
    const dVoteSliderValue = parseInt(document.getElementById("dVoteBreakdown").value);
    const oVoteSliderValue = parseInt(document.getElementById("oVoteBreakdown").value);

    updateVotePercentages('r', rVoteSliderValue, rReturned);
    updateVotePercentages('d', dVoteSliderValue, dReturned);
    updateVotePercentages('o', oVoteSliderValue, oReturned);

    updateTotalVotes();
}

function updateVotePercentages(party, sliderValue, returnedVotes) {
    const trumpPercent = 100 - sliderValue;
    const harrisPercent = sliderValue;
    const trumpVotes = Math.round((trumpPercent / 100) * returnedVotes);
    const harrisVotes = Math.round((harrisPercent / 100) * returnedVotes);

    document.getElementById(`${party}TrumpPercent`).textContent = `${trumpPercent}%`;
    document.getElementById(`${party}HarrisPercent`).textContent = `${harrisPercent}%`;
    document.getElementById(`${party}TrumpVotes`).textContent = formatNumberWithCommas(trumpVotes);
    document.getElementById(`${party}HarrisVotes`).textContent = formatNumberWithCommas(harrisVotes);
}

function updateTotalVotes() {
    const rTrumpVotes = removeCommas(document.getElementById("rTrumpVotes").textContent);
    const dTrumpVotes = removeCommas(document.getElementById("dTrumpVotes").textContent);
    const oTrumpVotes = removeCommas(document.getElementById("oTrumpVotes").textContent);
    const rHarrisVotes = removeCommas(document.getElementById("rHarrisVotes").textContent);
    const dHarrisVotes = removeCommas(document.getElementById("dHarrisVotes").textContent);
    const oHarrisVotes = removeCommas(document.getElementById("oHarrisVotes").textContent);

    const totalTrumpVotes = rTrumpVotes + dTrumpVotes + oTrumpVotes;
    const totalHarrisVotes = rHarrisVotes + dHarrisVotes + oHarrisVotes;

    document.getElementById("grandTotalTrumpVotes").textContent = formatNumberWithCommas(totalTrumpVotes);
    document.getElementById("grandTotalHarrisVotes").textContent = formatNumberWithCommas(totalHarrisVotes);

    updateProjectedFirewall(totalTrumpVotes, totalHarrisVotes);
}

function updateProjectedFirewall(trumpVotes, harrisVotes) {
    const firewallElement = document.getElementById("firewallResult");
    const difference = Math.abs(trumpVotes - harrisVotes);

    if (trumpVotes > harrisVotes) {
        firewallElement.textContent = `Current Projected Firewall: Trump + ${formatNumberWithCommas(difference)}`;
        firewallElement.style.color = 'red';
    } else if (harrisVotes > trumpVotes) {
        firewallElement.textContent = `Current Projected Firewall: Harris + ${formatNumberWithCommas(difference)}`;
        firewallElement.style.color = 'blue';
    } else {
        firewallElement.textContent = `Current Projected Firewall: Tied`;
        firewallElement.style.color = 'black';
    }
}

let custom2024Data = {
    requests: {
        R: 0,
        D: 0,
        O: 0
    },
    returns: {
        R: 0,
        D: 0,
        O: 0
    }
};

const electionData = {
    "2022": {
        requests: {
            R: 299264,
            D: 974865,
            O: 146878
        },
        returns: {
            R: 87.90,
            D: 87.95,
            O: 83.86
        }
    },
    "2020": {
        requests: {
            R: 772318,
            D: 1940836,
            O: 366556
        },
        returns: {
            R: 80.05,
            D: 88.56,
            O: 84.87
        }
    }
};

function populateElectionData(year) {
    let data;

    if (year === "2024") {
        // Use the custom 2024 data without resetting
        data = custom2024Data;
    } else {
        // Load predefined data for 2022 and 2020
        data = electionData[year];
    }

    // Set Ballot Requests
    document.getElementById("rBallotRequests").value = data.requests.R;
    document.getElementById("dBallotRequests").value = data.requests.D;
    document.getElementById("oBallotRequests").value = data.requests.O;

    // Set Ballot Returns with 1 decimal point
    document.getElementById("rReturnRate").value = data.returns.R.toFixed(1);
    document.getElementById("dReturnRate").value = data.returns.D.toFixed(1);
    document.getElementById("oReturnRate").value = data.returns.O.toFixed(1);

    // Trigger the calculations to update outputs
    calculateTotalBallotRequests();
    calculateReturnedBallots();

    // Update active tab
    document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab${year}`).classList.add('active');
}


// Save user changes for 2024
function saveCustom2024Data() {
    custom2024Data.requests.R = parseInt(document.getElementById("rBallotRequests").value);
    custom2024Data.requests.D = parseInt(document.getElementById("dBallotRequests").value);
    custom2024Data.requests.O = parseInt(document.getElementById("oBallotRequests").value);

    custom2024Data.returns.R = parseFloat(document.getElementById("rReturnRate").value);
    custom2024Data.returns.D = parseFloat(document.getElementById("dReturnRate").value);
    custom2024Data.returns.O = parseFloat(document.getElementById("oReturnRate").value);
}

// Add event listeners to track changes for 2024
document.getElementById("rBallotRequests").addEventListener("input", saveCustom2024Data);
document.getElementById("dBallotRequests").addEventListener("input", saveCustom2024Data);
document.getElementById("oBallotRequests").addEventListener("input", saveCustom2024Data);

document.getElementById("rReturnRate").addEventListener("input", saveCustom2024Data);
document.getElementById("dReturnRate").addEventListener("input", saveCustom2024Data);
document.getElementById("oReturnRate").addEventListener("input", saveCustom2024Data);

// Set 2024 as the default on page load
window.onload = function() {
    populateElectionData('2024');
};



// Event Listeners for sliders
document.getElementById("rVoteBreakdown").addEventListener("input", () => calculateReturnedBallots());
document.getElementById("dVoteBreakdown").addEventListener("input", () => calculateReturnedBallots());
document.getElementById("oVoteBreakdown").addEventListener("input", () => calculateReturnedBallots());
