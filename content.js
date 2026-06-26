let lastSelectedText = "";
let debounceTimer;

function handleSelection() {
    // 1. Stop if the extension context is dead
    if (!chrome.runtime?.id) return;

    // 2. Grab the text
    let selectedText = window.getSelection().toString().trim();
    
    // 3. Fallback for text boxes
    if (!selectedText && document.activeElement) {
        const el = document.activeElement;
        if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')) {
            selectedText = el.value.substring(el.selectionStart, el.selectionEnd).trim();
        }
    }
    
    // 4. Send the text ONLY if it is a new selection
    if (selectedText.length > 0 && selectedText !== lastSelectedText) {
        lastSelectedText = selectedText;
        
        chrome.runtime.sendMessage({
            type: "TEXT_SELECTED",
            text: selectedText
        }).catch(() => {
            // Ignore safely if sidebar is closed
        });
    }
}

// This function resets the timer every time the mouse moves.
// It only runs handleSelection() after you stop for 400 milliseconds.
function triggerDebouncedSelection() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleSelection, 400); 
}

// Listen to multiple event types to bypass website restrictions
document.addEventListener('selectionchange', triggerDebouncedSelection, true);
document.addEventListener('mouseup', triggerDebouncedSelection, true);
document.addEventListener('keyup', triggerDebouncedSelection, true);