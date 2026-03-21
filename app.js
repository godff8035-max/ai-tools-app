const firebaseConfig = {
  apiKey: "AIzaSyD89x5czKFVezFTZSx7RiSbsHX4wq1k4_U",
  authDomain: "ai-tools-app-6c5a7.firebaseapp.com",
  projectId: "ai-tools-app-6c5a7",
  storageBucket: "ai-tools-app-6c5a7.firebasestorage.app",
  messagingSenderId: "296908376584",
  appId: "1:296908376584:web:900d8d77a58ed3ba005fbd",
  measurementId: "G-3P8K87Q80T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let userId = null;

// LOGIN
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(() => {
      console.log("Login success");
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}

// AFTER LOGIN
auth.onAuthStateChanged(async (user) => {
  if (user) {
    userId = user.uid;

    const docRef = db.collection("users").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set({
        credits: 3
      });
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
  const docRef = db.collection("users").doc(userId);
  const doc = await docRef.get();

  let credits = doc.data().credits;

  if (credits <= 0) {
    alert("No credits left!");
    return;
  }

  await docRef.update({
    credits: credits - 1
  });

  loadCredits();

  const input = document.getElementById("input").value;

  document.getElementById("output").innerText =
    "🔥 Caption about " + input;
}