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

document.getElementById("joinBtn").addEventListener("click", () => {
    window.open("https://t.me/+sVoxUBy6_8A3MDVl", "_blank");

    firebase.database().ref("clicks/telegram").push({
        time: Date.now()
    });
});

document.getElementById("youtubeBtn").addEventListener("click", () => {
    window.open("https://www.youtube.com/@omprakashnanda4140", "_blank");

    firebase.database().ref("clicks/youtube").push({
        time: Date.now()
    });
});

document.getElementById("refBtn").addEventListener("click", () => {
    alert("Referral System Coming Soon");
});

document.getElementById("withdrawBtn").addEventListener("click", () => {
    alert("Withdraw System Coming Soon");
});
