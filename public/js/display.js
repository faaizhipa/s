// Display Screen JavaScript with fibbage-style flow
const BASE_LINK = 'https://faaizhipa.github.io/TrickOrTreat/public';
const GIFTS = {
    ubeesize: "UBeesize 62'' Magnetic Selfie Stick Phone Tripod with Wireless Remote, Extendable Cell Phone Tripod Stand, Compatible with MagSafe, Cellphone Tripod for iPhone 17 16 15 14 13 12 and Android Phones",
    lovevook: "LOVEVOOK Laptop Backpack for Women with Pouch Pocket for Large Capacity Cup, 17 Inch Teacher Nurse College Work Backpack Purse, Waterproof Laptop Bag Computer Back Pack for Travel, Beige-Pink-Brown",
    shenhe: "SHENHE Women's 2 Pack Satin Pajama Set Button Down Short Sleeve Striped Top and Bow Shorts Pjs Set Loungewear Black and Pink Small"
};

const CONFETTI_DURATION = 2600;

let currentSessionId = null;
let sessionRef = null;
let tvCountdownInterval = null;
let introShown = false;
let revealShown = false;
let wakeLock = null;

// Generate UUID using crypto API for better security
function generateUUID() {
    return 'default-session';
}

// Initialize the display
async function init() {
    try {
        currentSessionId = generateUUID();
        sessionRef = database.ref('sessions/' + currentSessionId);
        await sessionRef.set({
            id: currentSessionId,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            status: 'waiting',
            selection: null
        });

        listenForSession();

        // Cleanup after 1 hour
        setTimeout(() => cleanupSession(), 60 * 60 * 1000);

        console.log('Session created:', currentSessionId);
        console.log('Users should access:', `${BASE_LINK}/mobile.html (auto-connects to session)`);

        // Update the displayed URL
        const urlText = document.querySelector('.url-text');
        if (urlText) {
            urlText.textContent = `${BASE_LINK}/mobile.html`;
        }
    } catch (error) {
        console.error('Failed to create session:', error);
        const urlDisplay = document.getElementById('url-display');
        if (urlDisplay) {
            urlDisplay.innerHTML = '<div class="error">Failed to initialize. Please refresh the page.</div>';
        }
    }
}

function listenForSession() {
    sessionRef.on('value', (snapshot) => {
        const session = snapshot.val();
        if (!session) return;

        if (session.status === 'countdown' && !introShown) {
            startIntro();
        }

        if (session.status === 'selected' && session.selection && !revealShown) {
            showReveal(session.selection);
        }
    });
}

function startIntro() {
    introShown = true;
    // Remove dark overlay - the screen "wakes up"
    wakeUpScreen();
    document.getElementById('normal-display').classList.remove('active');
    document.getElementById('sequence-display').classList.add('active');
    showStep('intro-step');
    startTvCountdown();
}

// Remove the dark overlay and request wake lock
async function wakeUpScreen() {
    const overlay = document.getElementById('dark-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
    await requestWakeLock();
}

// Screen Wake Lock API to prevent display from sleeping
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen Wake Lock acquired');
            wakeLock.addEventListener('release', () => {
                console.log('Screen Wake Lock released');
                wakeLock = null;
            });
        } catch (err) {
            console.error('Failed to acquire wake lock:', err);
        }
    } else {
        console.log('Screen Wake Lock API not supported');
    }
}

// Re-acquire wake lock when page becomes visible again
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && introShown && wakeLock === null) {
        await requestWakeLock();
    }
});

function startTvCountdown() {
    const tvCount = document.getElementById('tv-countdown');
    let value = 3;
    tvCount.textContent = value;
    if (tvCountdownInterval) {
        clearInterval(tvCountdownInterval);
    }
    tvCountdownInterval = setInterval(() => {
        value -= 1;
        if (value <= 0) {
            clearInterval(tvCountdownInterval);
            tvCount.textContent = '0';
        } else {
            tvCount.textContent = value;
        }
    }, 1000);
}

function showReveal(selection) {
    revealShown = true;
    document.getElementById('sequence-display').classList.add('active');
    document.getElementById('normal-display').classList.remove('active');
    showStep('reveal-step');

    const giftLabel = escapeHtml(GIFTS[selection.gift] || selection.gift || 'a surprise');
    const choiceReveal = document.getElementById('choice-reveal');
    choiceReveal.textContent = `Shantini chooses... ${giftLabel}!`;

    const deliveryNote = document.getElementById('delivery-note');
    if (selection.delivery === 'office') {
        deliveryNote.textContent = 'Deliver it to the office — fibbage finale mode activated.';
        document.getElementById('ending-note').textContent = 'Happy holidays and all the best with your studies!';
    } else {
        deliveryNote.textContent = 'Home delivery it is. Promise I have no idea where you live (but Sarah does).';
        document.getElementById('ending-note').textContent = 'Happy holidays! Your gift is on its way.';
    }

    launchConfetti();
}

function showStep(stepId) {
    const steps = document.querySelectorAll('.sequence-step');
    steps.forEach(step => step.classList.remove('active'));
    const activeStep = document.getElementById(stepId);
    if (activeStep) {
        activeStep.classList.add('active');
    }
}

function launchConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#ffdf6d', '#ff9cee', '#c6b5ff', '#8ef1ff', '#ffb3ba'];
    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('span');
        piece.classList.add('confetto');
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random()}s`;
        container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ''; }, CONFETTI_DURATION);
}

// Cleanup session from Firebase
function cleanupSession() {
    if (sessionRef) {
        sessionRef.update({ status: 'completed' }).then(() => {
            setTimeout(() => sessionRef.remove(), 5000);
        });
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function setupAudioToggle() {
    const audio = document.getElementById('fibbage-audio');
    const toggle = document.getElementById('sound-toggle');
    if (!audio || !toggle) return;

    toggle.addEventListener('click', async () => {
        try {
            if (audio.paused) {
                await audio.play();
                toggle.textContent = 'Pause fibbage vibes';
            } else {
                audio.pause();
                toggle.textContent = 'Play fibbage vibes';
            }
        } catch (err) {
            console.error('Audio playback blocked', err);
        }
    });
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupAudioToggle();
    init();
});
