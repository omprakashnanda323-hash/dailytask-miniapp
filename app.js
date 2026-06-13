alert("app.js loaded");
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

firebase.database().ref("test").set({
    time: Date.now()
});
let userId = localStorage.getItem("userId");

if (!userId) {
userId = Date.now().toString();
localStorage.setItem("userId", userId);
}

let referralCount = 0;

const params = new URLSearchParams(window.location.search);
const referrerId = params.get("ref");

alert("ref = " + referrerId);

if (referrerId && referrerId !== userId) {

```
alert("Referrer Found: " + referrerId);

firebase.database()
    .ref("users/" + referrerId + "/count")
    .transaction((current) => {
        return (current || 0) + 1;
    });

localStorage.setItem("refCounted", "yes");
```

}


firebase.database().ref("users/" + userId + "/count").on("value", (snapshot) => {
referralCount = snapshot.val() || 0;

```
document.getElementById("refCount").innerText =
    "Referrals: " + referralCount;
```

});

document.getElementById("joinBtn").addEventListener("click", () => {
window.open("https://t.me/+sVoxUBy6_8A3MDVl", "_blank");

```
firebase.database().ref("clicks/telegram").push({
    time: Date.now()
});
```

});

document.getElementById("youtubeBtn").addEventListener("click", () => {
window.open("https://www.youtube.com/@omprakashnanda4140", "_blank");

```
firebase.database().ref("clicks/youtube").push({
    time: Date.now()
});
```

});

document.getElementById("refBtn").addEventListener("click", () => {
    alert("Referral Button Clicked");

    const referralLink =
    "https://omprakashnanda323-hash.github.io/dailytask-miniapp/?ref=" + userId;

    navigator.clipboard.writeText(referralLink);

    alert("Referral Link:\n" + referralLink);
});

document.getElementById("withdrawBtn").addEventListener("click", () => {
alert("Withdraw System Coming Soon");
});
