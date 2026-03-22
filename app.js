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
  auth.signInWithPopup(provider);
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
      await userRef.set({ credits: 5 });
    }

    loadCredits();
  }
});

// LOAD CREDITS
async function loadCredits() {
  const doc = await db.collection("users").doc(userId).get();
  document.getElementById("credits").innerText =
    "Credits: " + doc.data().credits;
}

// GENERATE
async function generate() {
  if (!userId) {
    alert("Login first");
    return;
  }

  const input = document.getElementById("input").value.trim();

  if (!input) {
    alert("Enter topic");
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
    const response = await fetch("https://ai-backend-nn06.onrender.com/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ input })
});

const data = await response.json();

document.getElementById("output").innerText = data.result;

    await userRef.update({
      credits: credits - 1
    });

    loadCredits();

  } catch (error) {
    document.getElementById("output").innerText = "Error";
  }
}
document.getElementById("earnBtn").onclick = async () => {
  if (!userId) {document.getElementById("earnBtn").classList.remove("hidden");
    alert("Login first");
    return;
  }

  alert("🎥 Watching ad...");

  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();

  let credits = doc.data().credits;

  await userRef.update({
    credits: credits + 1
  });

  alert("✅ You earned 1 credit!");
  loadCredits();
};
