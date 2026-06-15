const firebaseConfig = {
apiKey: "AIzaSyBUxAiC17gKvnyVAdZEuQ0IEi3ctzckd_Y",
authDomain: "dailytask-earning.firebaseapp.com",
databaseURL: "https://dailytask-earning-default-rtdb.firebaseio.com",
projectId: "dailytask-earning",
storageBucket: "dailytask-earning.firebasestorage.app",
messagingSenderId: "1054491992628",
appId: "1:1054491992628:web:e5f4820e9a77ef38252061"
};

firebase.initializeApp(firebaseConfig);

let userId = localStorage.getItem("userId");

if (!userId) {
userId = Date.now().toString();
localStorage.setItem("userId", userId);
}

let referralCount = 0;
let balance = 0;
let completedTasks = 0;

const params = new URLSearchParams(window.location.search);
const referrerId = params.get("ref");

// Referral protection
if (
referrerId &&
referrerId !== userId &&
!localStorage.getItem("ref_used")
) {
firebase.database()
.ref("users/" + referrerId + "/count")
.transaction((current) => {
return (current || 0) + 1;
});


localStorage.setItem("ref_used", "yes");


}

// Load user data
firebase.database().ref("users/" + userId).on("value", (snapshot) => {


const data = snapshot.val() || {};

referralCount = data.count || 0;

let taskBalance = data.taskBalance || 0;
    
completedTasks = data.completedTasks || 0;
    
balance = (referralCount * 5) + taskBalance;

document.getElementById("refCount").innerText =
    "Referrals: " + referralCount;

document.getElementById("balance").innerText =
    "Balance: ₹" + balance;


});

// Telegram Task
document.getElementById("joinBtn").addEventListener("click", () => {


window.open("https://t.me/+sVoxUBy6_8A3MDVl", "_blank");

if (!localStorage.getItem("telegram_done")) {

    firebase.database()
        .ref("users/" + userId + "/taskBalance")
        .transaction((current) => {
            return (current || 0) + 1;
        });

    localStorage.setItem("telegram_done", "yes");

    alert("₹1 Added");
}


});

// YouTube Task
document.getElementById("youtubeBtn").addEventListener("click", () => {


window.open(
    "https://www.youtube.com/@omprakashnanda4140",
    "_blank"
);

if (!localStorage.getItem("youtube_done")) {

    firebase.database()
        .ref("users/" + userId + "/taskBalance")
        .transaction((current) => {
            return (current || 0) + 1;
        });

    localStorage.setItem("youtube_done", "yes");

    alert("₹1 Added");
}


});

// Referral Link
document.getElementById("refBtn").addEventListener("click", () => {


const referralLink =
    "https://omprakashnanda323-hash.github.io/dailytask-miniapp/?ref=" +
    userId;

navigator.clipboard.writeText(referralLink);

alert("Referral Link Copied");


});

// Withdraw
document.getElementById("withdrawBtn").addEventListener("click", () => {


const upiId = document.getElementById("upiId").value;

if (!upiId) {
    alert("Enter UPI ID");
    return;
}

if (referralCount < 10) {
    alert("Minimum 10 referrals required");
    return;
}

if (completedTasks < 2) {
    alert("Complete minimum 2 tasks");
    return;
}

if (balance < 100) {
    alert("Minimum ₹100 required");
    return;
}

firebase.database().ref("withdrawRequests").push({
    userId: userId,
    upiId: upiId,
    balance: balance,
    referrals: referralCount,
    time: Date.now()
});

alert("Withdraw Request Submitted");


});

// Leaderboard
firebase.database().ref("users").on("value", (snapshot) => {

const users = snapshot.val() || {};

let arr = [];

for (let id in users) {

    arr.push({
        id: id,
        refs: users[id].count || 0
    });
}

arr.sort((a, b) => b.refs - a.refs);

let html = "";

arr.slice(0, 10).forEach((user, index) => {

    html +=
        (index + 1) +
        ". " +
        user.id.substring(0, 6) +
        " - " +
        user.refs +
        " referrals<br>";
});

document.getElementById("leaderboard").innerHTML = html;

});

document.getElementById("taskBtn").addEventListener("click", () => {

const taskSection = document.getElementById("taskSection");

if (taskSection.style.display === "none") {
    taskSection.style.display = "block";
} else {
    taskSection.style.display = "none";
}

});

document.getElementById("submitApp1").addEventListener("click", () => {
    submitTask("WG Refer", "app1Uid");
});

document.getElementById("submitApp2").addEventListener("click", () => {
    submitTask("DailyDo", "app2Uid");
});

document.getElementById("submitApp3").addEventListener("click", () => {
    submitTask("Service Hut", "app3Uid");
});

function submitTask(appName, inputId) {

    const uid = document.getElementById(inputId).value;

    if (!uid) {
        alert("Enter UID");
        return;
    }

    firebase.database().ref("taskRequests").push({
        userId: userId,
        app: appName,
        uid: uid,
        reward: 2,
        status: "pending",
        time: Date.now()
    });

    alert("Task submitted successfully");

    document.getElementById(inputId).value = "";
}
