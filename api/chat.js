// CommonJS syntax for Vercel serverless functions
module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.WORKFLOW_ID;

    if (!apiKey || !workflowId) {
        console.error("Missing Environment Variables");
        return res.status(500).json({ error: 'Server configuration error: Missing Environment Variables' });
    }

    try {
        console.log("Creating ChatKit session via OpenAI API...");

        // Using raw fetch as per the documentation
        const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "OpenAI-Beta": "chatkit_beta=v1"
            },
            body: JSON.stringify({
                workflow: { id: workflowId },
                user: "anonymous-user"  // Required parameter per official docs
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`OpenAI API Error (${response.status}):`, errorText);
            throw new Error(`OpenAI API failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Session created successfully");

        return res.status(200).json({ client_secret: data.client_secret });

    } catch (error) {
        console.error('Handler Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
