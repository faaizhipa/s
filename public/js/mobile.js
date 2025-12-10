// Mobile Flow for fibbage-style gift selection
const ALLOWED_GIFTS = ['ubeesize', 'lovevook', 'shenhe'];
const ALLOWED_DELIVERY = ['home', 'office'];

let sessionId = null;
let sessionRef = null;
let countdownTimer = null;

async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    sessionId = urlParams.get('session');

    if (typeof database === 'undefined') {
        showError('Connection unavailable. Please refresh and try again.');
        return;
    }

    // If no session ID in URL, use default
    if (!sessionId) {
        sessionId = 'default-session';
    }

    sessionRef = database.ref('sessions/' + sessionId);

    // Verify the session exists
    try {
        const snapshot = await sessionRef.once('value');
        if (!snapshot.exists()) {
            showError('Session not found. Please make sure the display screen is running.');
            return;
        }
    } catch (error) {
        console.error('Session verification failed:', error);
        showError('Failed to verify session. Please try again.');
        return;
    }

    markCountdown();
    startCountdown();

    const form = document.getElementById('submission-form');
    form.addEventListener('submit', handleSubmit);
}

async function markCountdown() {
    try {
        const snapshot = await sessionRef.once('value');
        if (!snapshot.exists()) {
            showError('Session not found. Please make sure the display screen is running.');
            return;
        }

        const data = snapshot.val();
        if (data.status !== 'selected') {
            await sessionRef.update({
                status: 'countdown',
                startedAt: firebase.database.ServerValue.TIMESTAMP
            });
        }
    } catch (error) {
        console.error('Countdown update failed', error);
    }
}

function startCountdown() {
    const counter = document.getElementById('countdown-number');
    let value = 3;
    counter.textContent = value;
    countdownTimer = setInterval(() => {
        value -= 1;
        if (value <= 0) {
            clearInterval(countdownTimer);
            counter.textContent = '0';
            showView('form-view');
        } else {
            counter.textContent = value;
        }
    }, 1000);
}

function validateFormData(formData) {
    if (!ALLOWED_GIFTS.includes(formData.gift)) {
        return { valid: false, error: 'Choose a gift option to continue.' };
    }
    if (!ALLOWED_DELIVERY.includes(formData.delivery)) {
        return { valid: false, error: 'Pick a delivery vibe (home or office).' };
    }

    return {
        valid: true,
        data: {
            gift: formData.gift,
            delivery: formData.delivery,
            submittedAt: Date.now()
        }
    };
}

async function handleSubmit(event) {
    event.preventDefault();

    const gift = document.querySelector('input[name="gift"]:checked')?.value;
    const delivery = document.querySelector('input[name="delivery"]:checked')?.value;

    const validation = validateFormData({ gift, delivery });
    if (!validation.valid) {
        showError(validation.error);
        return;
    }

    const submitBtn = event.target.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const snapshot = await sessionRef.once('value');
        if (!snapshot.exists()) {
            showError('Session not found. Please make sure the display screen is running.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send my pick';
            return;
        }

        await sessionRef.update({
            status: 'selected',
            selection: validation.data,
            submittedAt: firebase.database.ServerValue.TIMESTAMP
        });

        showSuccess();
    } catch (error) {
        console.error('Submission error:', error);
        showError('Failed to submit. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send my pick';
    }
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
    }
}

function showSuccess() {
    showView('success-view');
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    showView('error-view');
}

document.addEventListener('DOMContentLoaded', init);
