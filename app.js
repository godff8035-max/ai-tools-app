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
    const captions = [
      `🔥 Living my best ${input} life!`,
      `✨ ${input} vibes only`,
      `💯 Can't get enough of ${input}`,
      `🌍 Exploring ${input}`,
      `😎 ${input} mood`,
      `🚀 ${input} to next level`,
      `❤️ Love ${input}`,
      `📸 ${input} moments`,
      `🌟 ${input} vibe`,
      `🎯 ${input} goals`
    ];

    const random = captions[Math.floor(Math.random() * captions.length)];

    document.getElementById("output").innerText = random;

    await userRef.update({
      credits: credits - 1
    });

    loadCredits();

  } catch (error) {
    document.getElementById("output").innerText = "Error";
  }
}