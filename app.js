const firebaseConfig = {
  apiKey: "AIzaSyD89x5czKFVezFTZSx7RiSbsHX4wq1k4_U",
  authDomain: "ai-tools-app-6c5a7.firebaseapp.com",
  projectId: "ai-tools-app-6c5a7",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let userId = null;

// LOGIN
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

// LOGOUT
function logout() {
  auth.signOut().then(() => location.reload());
}

// AUTH STATE
auth.onAuthStateChanged(async (user) => {
  if (user) {
    userId = user.uid;

    document.getElementById("loginBtn").classList.add("hidden");
    document.getElementById("logoutBtn").classList.remove("hidden");

    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({ credits: 3 });
    }

    loadCredits();

  } else {
    document.getElementById("loginBtn").classList.remove("hidden");
    document.getElementById("logoutBtn").classList.add("hidden");
  }
});

// LOAD CREDITS
async function loadCredits() {
  const doc = await db.collection("users").doc(userId).get();
  document.getElementById("credits").innerText =
    "Credits: " + doc.data().credits;
}

// GENERATE (REAL AI READY)
async function generate() {
  if (!userId) {
    alert("Please login first");
    return;
  }

  const input = document.getElementById("input").value.trim();

  if (!input) {
    alert("Enter a topic");
    return;
  }

  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();

  let credits = doc.data().credits;

  if (credits <= 0) {
    alert("No credits left!");
    return;
  }

  document.getElementById("output").innerText = "⏳ Generating...";

  try {
    // TEMP FAKE AI (safe for now)
    const captions = [
      `🔥 Living the ${input} life!`,
      `✨ ${input} vibes only`,
      `💯 Can't get enough of ${input}`
    ];

    document.getElementById("output").innerText =
      captions.join("\n\n");

    // Deduct credit AFTER success
    await userRef.update({
      credits: credits - 1
    });

    loadCredits();

  } catch (error) {
    console.error(error);
    document.getElementById("output").innerText = "❌ Error occurred";
  }
}