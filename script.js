
const askButton = document.getElementById("askButton");
const questionInput = document.getElementById("question");
const subjectSelect = document.getElementById("subject");
const answerBox = document.getElementById("answer");

if (askButton && questionInput && subjectSelect && answerBox) {
    askButton.addEventListener("click", async () => {
        const question = questionInput.value.trim();
        const subject = subjectSelect.value;

        if (!question) {
            questionInput.focus();
            return;
        }

        answerBox.classList.remove("hidden");
        answerBox.replaceChildren();

        const heading = document.createElement("h3");
        heading.textContent = "StudyPilot AI";

        const message = document.createElement("p");
        message.textContent = "Thinking through your question...";

        answerBox.append(heading, message);

        askButton.disabled = true;
        askButton.textContent = "Thinking...";

        try {
            const response = await fetch("/api/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question, subject })
            });

            const responseText = await response.text();
            let data;

            try {
                data = JSON.parse(responseText);
            } catch {
                console.error("Invalid server response:", responseText);
                throw new Error(
                    "Invalid server response. Check the VS Code terminal."
                );
            }

            if (!response.ok) {
                throw new Error(data.error || "Request failed.");
            }

            if (typeof data.answer !== "string") {
                throw new Error("The server response did not contain an answer.");
            }

            message.textContent = data.answer;
        } catch (error) {
            console.error("StudyPilot AI error:", error);
            message.textContent = error.message ||
                "Couldn't reach the AI tutor. Please try again.";
        } finally {
            askButton.disabled = false;
            askButton.textContent = "Ask StudyPilot AI →";
        }
    });
} else {
    console.error(
        "StudyPilot AI: One or more HTML elements could not be found."
    );
}
