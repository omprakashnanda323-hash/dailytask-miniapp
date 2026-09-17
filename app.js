// =====================================================
// DAILY TASK EARNING - APP.JS
// Firebase Auth UID + Referral + Tasks + Withdraw
// =====================================================


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyBUxAiC17gKvnyVAdZEuQ0IEi3ctzckd_Y",
    authDomain: "dailytask-earning.firebaseapp.com",
    databaseURL: "https://dailytask-earning-default-rtdb.firebaseio.com",
    projectId: "dailytask-earning",
    storageBucket: "dailytask-earning.firebasestorage.app",
    messagingSenderId: "1054491992628",
    appId: "1:1054491992628:web:e5f4820e9a77ef38252061"
};


// =====================================================
// FIREBASE INIT
// =====================================================

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth();


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let userId = null;

let referralCount = 0;
let taskBalance = 0;
let completedTasks = 0;
let balance = 0;


// =====================================================
// REFERRAL LINK HANDLER
// =====================================================

(function () {

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (
        ref &&
        !window.location.pathname.endsWith("register.html") &&
        !window.location.pathname.endsWith("login.html")
    ) {

        localStorage.setItem("pendingReferral", ref);

        window.location.href =
            "register.html?ref=" + encodeURIComponent(ref);
    }

})();


// =====================================================
// WAIT FOR FIREBASE LOGIN
// =====================================================

auth.onAuthStateChanged(function (user) {

    // Login/Register page par redirect mat karo
    if (
        window.location.pathname.endsWith("login.html") ||
        window.location.pathname.endsWith("register.html")
    ) {
        return;
    }

    // Main website ke liye login required
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Firebase Auth UID
    userId = user.uid;

    localStorage.setItem("userId", userId);

    loadUserData();

    setupTelegramTask();
    setupYoutubeTask();
    setupWhatsapp();
    setupReferralButton();
    setupWithdraw();
    setupTaskToggle();
    setupTaskButtons();
    loadLeaderboard();

});


// =====================================================
// LOAD USER DATA
// =====================================================

function loadUserData() {

    if (!userId) return;

    db.ref("users/" + userId).on("value", function (snapshot) {

        const data = snapshot.val() || {};


        // Referral count
        referralCount = Number(data.count || 0);


        // Task balance
        taskBalance = Number(data.taskBalance || 0);


        // Completed tasks
        completedTasks = Number(data.completedTasks || 0);


        // Referral earning
        const referralEarning = referralCount * 5;


        // TOTAL BALANCE
        balance = referralEarning + taskBalance;


        // -------------------------------------------------
        // REFERRAL COUNT
        // -------------------------------------------------

        const refCountElement =
            document.getElementById("refCount");

        if (refCountElement) {

            refCountElement.innerText =
                "Referrals: " + referralCount;
        }


        // -------------------------------------------------
        // REFERRAL EARNING
        // -------------------------------------------------

        const referralBalanceElement =
            document.getElementById("referralBalance");

        if (referralBalanceElement) {

            referralBalanceElement.innerText =
                "Referral Earnings: ₹" + referralEarning;
        }


        // -------------------------------------------------
        // TOTAL BALANCE
        // -------------------------------------------------

        const balanceElement =
            document.getElementById("balance");

        if (balanceElement) {

            balanceElement.innerText =
                "Balance: ₹" + balance;
        }


        // -------------------------------------------------
        // TASK BALANCE
        // -------------------------------------------------

        const taskBalanceElement =
            document.getElementById("taskBalance");

        if (taskBalanceElement) {

            taskBalanceElement.innerText =
                "Task Earnings: ₹" + taskBalance;
        }


        // -------------------------------------------------
        // COMPLETED TASKS
        // -------------------------------------------------

        const completedTasksElement =
            document.getElementById("completedTasks");

        if (completedTasksElement) {

            completedTasksElement.innerText =
                "Completed Tasks: " + completedTasks;
        }

    });

}


// =====================================================
// TELEGRAM TASK
// =====================================================

function setupTelegramTask() {

    const joinBtn =
        document.getElementById("joinBtn");

    if (!joinBtn) return;


    joinBtn.addEventListener("click", function () {

        window.open(
            "https://t.me/+sVoxUBy6_8A3MDVl",
            "_blank"
        );


        if (!localStorage.getItem("telegram_done_" + userId)) {

            db.ref(
                "users/" + userId + "/taskBalance"
            ).transaction(function (current) {

                return (Number(current) || 0) + 1;

            });


            localStorage.setItem(
                "telegram_done_" + userId,
                "yes"
            );


            alert("₹1 Added");
        }

    });

}


// =====================================================
// YOUTUBE TASK
// =====================================================

function setupYoutubeTask() {

    const youtubeBtn =
        document.getElementById("youtubeBtn");

    if (!youtubeBtn) return;


    youtubeBtn.addEventListener("click", function () {

        window.open(
            "https://www.youtube.com/@omprakashnanda4140",
            "_blank"
        );


        if (!localStorage.getItem("youtube_done_" + userId)) {

            db.ref(
                "users/" + userId + "/taskBalance"
            ).transaction(function (current) {

                return (Number(current) || 0) + 1;

            });


            localStorage.setItem(
                "youtube_done_" + userId,
                "yes"
            );


            alert("₹1 Added");
        }

    });

}


// =====================================================
// WHATSAPP SUPPORT
// =====================================================

function setupWhatsapp() {

    const whatsappBtn =
        document.getElementById("whatsappBtn");

    if (!whatsappBtn) return;


    whatsappBtn.addEventListener("click", function () {

        window.open(
            "https://chat.whatsapp.com/EsGi004mef1381COmn0qpt?s=cl&p=a&mlu=4&ilr=4",
            "_blank"
        );

    });

}


// =====================================================
// REFERRAL BUTTON
// =====================================================

function setupReferralButton() {

    const refBtn =
        document.getElementById("refBtn");

    if (!refBtn) return;


    refBtn.addEventListener("click", function () {

        if (!userId) {

            alert("Please login first.");
            return;
        }


        const referralLink =
            "https://omprakashnanda323-hash.github.io/dailytask-miniapp/?ref=" +
            userId;


        if (navigator.clipboard) {

            navigator.clipboard.writeText(
                referralLink
            );

            alert(
                "Referral Link Copied!\n\n" +
                referralLink
            );

        } else {

            alert(referralLink);

        }

    });

}


// =====================================================
// WITHDRAW
// =====================================================

function setupWithdraw() {

    const withdrawBtn =
        document.getElementById("withdrawBtn");

    if (!withdrawBtn) return;


    withdrawBtn.addEventListener("click", function () {

        const upiElement =
            document.getElementById("upiId");


        const upiId =
            upiElement ?
            upiElement.value.trim() :
            "";


        // UPI CHECK
        if (!upiId) {

            alert("Enter UPI ID");
            return;
        }


        // REFERRAL CHECK
        if (referralCount < 10) {

            alert(
                "Minimum 10 referrals required"
            );

            return;
        }


        // TASK CHECK
        if (completedTasks < 2) {

            alert(
                "Complete minimum 2 tasks"
            );

            return;
        }


        // BALANCE CHECK
        if (balance < 100) {

            alert(
                "Minimum ₹100 required"
            );

            return;
        }


        // -------------------------------------------------
        // WITHDRAW REQUEST
        // -------------------------------------------------

        db.ref("withdrawRequests").push({

            userId: userId,

            upiId: upiId,

            balance: balance,

            referrals: referralCount,

            completedTasks: completedTasks,

            status: "pending",

            time: Date.now()

        })
        .then(function () {

            alert(
                "Withdraw Request Submitted"
            );

        })
        .catch(function (error) {

            console.error(error);

            alert(
                "Withdraw request failed: " +
                error.message
            );

        });

    });

}


// =====================================================
// LEADERBOARD
// =====================================================

function loadLeaderboard() {

    db.ref("users").on("value", function (snapshot) {

        const users =
            snapshot.val() || {};


        let arr = [];


        for (let id in users) {

            arr.push({

                id: id,

                refs:
                    Number(users[id].count || 0)

            });

        }


        // SORT
        arr.sort(function (a, b) {

            return b.refs - a.refs;

        });


        let html = "";


        arr.slice(0, 10).forEach(
            function (user, index) {

                html +=
                    (index + 1) +
                    ". " +
                    user.id.substring(0, 6) +
                    " - " +
                    user.refs +
                    " referrals<br>";

            }
        );


        const leaderboard =
            document.getElementById("leaderboard");


        if (leaderboard) {

            leaderboard.innerHTML =
                html;

        }

    });

}


// =====================================================
// TASK SECTION TOGGLE
// =====================================================

function setupTaskToggle() {

    const taskBtn =
        document.getElementById("taskBtn");

    if (!taskBtn) return;


    taskBtn.addEventListener("click", function () {

        const taskSection =
            document.getElementById("taskSection");


        if (!taskSection) return;


        if (
            taskSection.style.display === "none" ||
            taskSection.style.display === ""
        ) {

            taskSection.style.display =
                "block";

        } else {

            taskSection.style.display =
                "none";

        }

    });

}


// =====================================================
// TASK SUBMISSION
// =====================================================

function submitTask(
    appName,
    inputId,
    reward
) {

    if (!userId) {

        alert(
            "Please login first."
        );

        return;
    }


    const input =
        document.getElementById(inputId);


    if (!input) {

        alert(
            "Input field not found"
        );

        return;
    }


    const uid =
        input.value.trim();


    if (!uid) {

        alert(
            "Enter UID / User ID"
        );

        return;
    }


    // -------------------------------------------------
    // PREVENT DUPLICATE SUBMISSION
    // -------------------------------------------------

    const taskKey =
        "task_submitted_" +
        appName
            .toLowerCase()
            .replace(/\s+/g, "_") +
        "_" +
        userId;


    if (localStorage.getItem(taskKey)) {

        alert(
            "You have already submitted this task."
        );

        return;
    }


    // -------------------------------------------------
    // SAVE TASK
    // -------------------------------------------------

    db.ref("taskRequests").push({

        userId: userId,

        app: appName,

        uid: uid,

        reward: Number(reward),

        status: "pending",

        rewardStatus:
            "waiting_for_first_successful_withdrawal",

        time: Date.now()

    })
    .then(function () {

        localStorage.setItem(
            taskKey,
            "yes"
        );


        input.value = "";


        alert(
            "Task Submitted Successfully!\n\n" +
            "Status: Pending Verification\n" +
            "Reward: ₹" + reward + "\n\n" +
            "Reward first successful withdrawal ke baad approve hoga."
        );

    })
    .catch(function (error) {

        console.error(error);

        alert(
            "Task submission failed: " +
            error.message
        );

    });

}


// =====================================================
// WG REFER
// =====================================================

function setupTaskButtons() {

    const submitApp1 =
        document.getElementById("submitApp1");


    if (submitApp1) {

        submitApp1.addEventListener(
            "click",
            function () {

                submitTask(
                    "WG Refer",
                    "app1Uid",
                    5
                );

            }
        );

    }


    // =================================================
    // FLIXFOX
    // =================================================

    const submitApp2 =
        document.getElementById("submitApp2");


    if (submitApp2) {

        submitApp2.addEventListener(
            "click",
            function () {

                submitTask(
                    "Flixfox",
                    "app2Uid",
                    2
                );

            }
        );

    }


    // =================================================
    // KICKCASH
    // =================================================

    const submitApp3 =
        document.getElementById("submitApp3");


    if (submitApp3) {

        submitApp3.addEventListener(
            "click",
            function () {

                submitTask(
                    "KickCash",
                    "app3Uid",
                    5
                );

            }
        );

    }


    // =================================================
    // NAVI
    // =================================================

    const submitApp4 =
        document.getElementById("submitApp4");


    if (submitApp4) {

        submitApp4.addEventListener(
            "click",
            function () {

                submitTask(
                    "Navi",
                    "app4Uid",
                    10
                );

            }
        );

    }

}
