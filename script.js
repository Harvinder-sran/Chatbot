// Function to fetch the session token from our backend (Strict Documentation Approach)
async function getClientSecret() {
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Backend Error (${res.status}):`, errorText);
            throw new Error(`Failed to get session: ${res.status} ${errorText}`);
        }

        const { client_secret } = await res.json();
        return client_secret;
    } catch (err) {
        console.error('Error fetching ChatKit session:', err);
        throw err; // Re-throw so the widget knows it failed
    }
}

// Initialize ChatKit when the window loads
window.addEventListener('load', () => {
    console.log('Window loaded, checking for ChatKit container...');
    const container = document.getElementById('chatkit-container');

    if (!container) {
        console.error('ChatKit container not found!');
        return;
    }

    let attempts = 0;
    const maxAttempts = 50; // 5 seconds approx

    // Polling helper to wait for the ChatKit script to upgrade the container
    const initWidget = () => {
        attempts++;
        console.log(`Checking for ChatKit widget (Attempt ${attempts})...`);

        // Check if the container has been upgraded with the setOptions method
        if (container && container.setOptions) {
            console.log('Container upgraded! Initializing with Session (Backend)...');

            container.setOptions({
                api: {
                    // "Recommended Integration": Get secret from backend
                    getClientSecret: async () => {
                        console.log('Fetching client secret from /api/chat...');
                        return await getClientSecret();
                    }
                }
            });
            console.log('ChatKit Widget Configured');
        } else {
            if (attempts >= maxAttempts) {
                console.error('ChatKit initialization timed out.');
                return;
            }
            // Widget not ready yet, try again shortly
            setTimeout(initWidget, 100);
        }
    };

    initWidget();
});
