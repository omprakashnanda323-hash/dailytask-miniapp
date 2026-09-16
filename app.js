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


// ============================
// REFERRAL SYSTEM
// ============================

const params = new URLSearchParams(window.location.search);

const referrerId = params.get("ref");


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


// ============================
// LOAD USER DATA
// ============================

firebase.database()
    .ref("users/" + userId)
    .on("value", (snapshot) => {

        const data = snapshot.val() || {};

        referralCount = data.count || 0;

        let taskBalance = data.taskBalance || 0;

        completedTasks = data.completedTasks || 0;

        balance =
            (referralCount * 5) +
            taskBalance;


        const refCountElement =
            document.getElementById("refCount");

        if (refCountElement) {

            refCountElement.innerText =
                "Referrals: " + referralCount;

        }


        const balanceElement =
            document.getElementById("balance");

        if (balanceElement) {

            balanceElement.innerText =
                "Balance: ₹" + balance;

        }

    });


// ============================
// TELEGRAM TASK
// ============================

const joinBtn =
    document.getElementById("joinBtn");


if (joinBtn) {

    joinBtn.addEventListener("click", () => {

        window.open(
            "https://t.me/+sVoxUBy6_8A3MDVl",
            "_blank"
        );


        if (!localStorage.getItem("telegram_done")) {

            firebase.database()
                .ref(
                    "users/" +
                    userId +
                    "/taskBalance"
                )
                .transaction((current) => {

                    return (current || 0) + 1;

                });


            localStorage.setItem(
                "telegram_done",
                "yes"
            );


            alert("₹1 Added");

        }

    });

}


// ============================
// YOUTUBE TASK
// ============================

const youtubeBtn =
    document.getElementById("youtubeBtn");


if (youtubeBtn) {

    youtubeBtn.addEventListener("click", () => {

        window.open(
            "https://www.youtube.com/@omprakashnanda4140",
            "_blank"
        );


        if (!localStorage.getItem("youtube_done")) {

            firebase.database()
                .ref(
                    "users/" +
                    userId +
                    "/taskBalance"
                )
                .transaction((current) => {

                    return (current || 0) + 1;

                });


            localStorage.setItem(
                "youtube_done",
                "yes"
            );


            alert("₹1 Added");

        }

    });

}


// ============================
// WHATSAPP GROUP
// ============================

const whatsappBtn =
    document.getElementById("whatsappBtn");


if (whatsappBtn) {

    whatsappBtn.addEventListener("click", () => {

        window.open(
            "https://chat.whatsapp.com/EsGi004mef1381COmn0qpt?s=cl&p=a&mlu=4&ilr=4",
            "_blank"
        );

    });

}


// ============================
// REFERRAL LINK
// ============================

const refBtn =
    document.getElementById("refBtn");


if (refBtn) {

    refBtn.addEventListener("click", () => {

        const referralLink =
            "https://omprakashnanda323-hash.github.io/dailytask-miniapp/?ref=" +
            userId;


        navigator.clipboard.writeText(
            referralLink
        );


        alert("Referral Link Copied");

    });

}


// ============================
// WITHDRAW
// ============================

const withdrawBtn =
    document.getElementById("withdrawBtn");


if (withdrawBtn) {

    withdrawBtn.addEventListener("click", () => {

        const upiElement =
            document.getElementById("upiId");


        if (!upiElement) {

            return;

        }


        const upiId =
            upiElement.value.trim();


        if (!upiId) {

            alert("Enter UPI ID");

            return;

        }


        if (referralCount < 10) {

            alert(
                "Minimum 10 referrals required"
            );

            return;

        }


        if (completedTasks < 2) {

            alert(
                "Complete minimum 2 tasks"
            );

            return;

        }


        if (balance < 100) {

            alert(
                "Minimum ₹100 required"
            );

            return;

        }


        firebase.database()
            .ref("withdrawRequests")
            .push({

                userId: userId,

                upiId: upiId,

                balance: balance,

                referrals: referralCount,

                completedTasks: completedTasks,

                status: "pending",

                time: Date.now()

            });


        alert(
            "Withdraw Request Submitted"
        );

    });

}


// ============================
// LEADERBOARD
// ============================

const leaderboard =
    document.getElementById("leaderboard");


if (leaderboard) {

    firebase.database()
        .ref("users")
        .on("value", (snapshot) => {

            const users =
                snapshot.val() || {};


            let arr = [];


            for (let id in users) {

                arr.push({

                    id: id,

                    refs:
                        users[id].count || 0

                });

            }


            arr.sort(
                (a, b) =>
                    b.refs - a.refs
            );


            let html = "";


            arr.slice(0, 10)
                .forEach((user, index) => {

                    html +=
                        (index + 1) +
                        ". " +
                        user.id.substring(0, 6) +
                        " - " +
                        user.refs +
                        " referrals<br>";

                });


            leaderboard.innerHTML =
                html;

        });

}


// ============================
// OLD TASK TOGGLE
// ============================

const taskBtn =
    document.getElementById("taskBtn");


if (taskBtn) {

    taskBtn.addEventListener(
        "click",
        () => {

            const taskSection =
                document.getElementById(
                    "taskSection"
                );


            if (!taskSection) {

                return;

            }


            if (
                taskSection.style.display ===
                "none"
            ) {

                taskSection.style.display =
                    "block";

            } else {

                taskSection.style.display =
                    "none";

            }

        }
    );

}


// ============================
// SUBMIT TASK
// ============================

function submitTask(
    appName,
    inputId,
    reward
) {

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
            "Enter your UID / User ID"
        );

        return;

    }


    // Create task request

    firebase.database()
        .ref("taskRequests")
        .push({

            userId: userId,

            app: appName,

            uid: uid,

            reward: reward,

            status: "pending",

            rewardStatus: "waiting_for_first_withdrawal",

            time: Date.now()

        });


    alert(
        "Task Submitted Successfully!\n\n" +
        "Reward: ₹" + reward +
        "\n\n" +
        "Reward will be approved after your 1st successful withdrawal."
    );


    input.value = "";

}
