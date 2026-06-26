chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "TEXT_SELECTED") {
        const text = message.text;
        
        document.getElementById("original").textContent = `"${text}"`;
        document.getElementById("translation").textContent = "Translating...";

        const sourceLang = document.getElementById("sourceLang").value;
        const targetLang = document.getElementById("targetLang").value;
        
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                let translatedText = "";
                if (data && data[0]) {
                    data[0].forEach(item => {
                        if (item[0]) translatedText += item[0];
                    });
                }
                
                // Update the translation text
                document.getElementById("translation").textContent = translatedText || "No translation found.";

                // --- UPDATED AUTO-DETECT LOGIC ---
                const originalTextLabel = document.getElementById("originalLabel");
                
                if (originalTextLabel) { // Safety check to ensure it exists
                    if (sourceLang === "auto" && data[2]) {
                        // data[2] contains the detected language code (e.g., "fr")
                        const detectedCode = data[2];
                        const select = document.getElementById("sourceLang");
                        
                        // Find the human-readable name in your dropdown
                        const option = Array.from(select.options).find(opt => opt.value === detectedCode);
                        if (option) {
                            originalTextLabel.textContent = `Original Text (Detected: ${option.text})`;
                        } else {
                            originalTextLabel.textContent = `Original Text (Detected: ${detectedCode.toUpperCase()})`;
                        }
                    } else {
                        originalTextLabel.textContent = "Original Text"; // Reset label if not using auto
                    }
                }

            })
            .catch(error => {
                document.getElementById("translation").textContent = "Error translating text.";
                console.error(error);
            });
    }
});