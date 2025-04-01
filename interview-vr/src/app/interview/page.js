"use client";

import { useState } from "react";

export default function InterviewPage() {
    const [response, setResponse] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        try {
            console.log("message:", message);
            if (!message) {
                setResponse("Please enter a message.");
                return;
            }
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: message }),  // ✅ Fix: Changed message -> prompt
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Request failed");
            }

            const data = await res.json();
            setResponse(data.message);
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error: " + error.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Interview API Test</h1>
            <input
                type="text"
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={handleSubmit} style={{ padding: "5px 10px" }}>
                Send
            </button>
            <p>Response: {response}</p>
        </div>
    );
}
