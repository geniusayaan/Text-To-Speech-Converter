// Get references to the HTML elements
const textarea = document.querySelector("textarea"),
      voiceList = document.querySelector("select"),
      speechBtn = document.querySelector("button");

// Get the main Speech Synthesis object
let synth = speechSynthesis;

// Function to populate the voice list in the dropdown
function populateVoiceList() {
    // Clear existing options before repopulating
    voiceList.innerHTML = '';
    
    // Get all available voices from the user's system and browser
    for (let voice of synth.getVoices()) {
        let selected = voice.name === "Google US English" ? "selected" : "";
        
        // Create an option tag for each voice
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    }
}

// The 'voiceschanged' event is crucial. It ensures the voices are loaded before trying to list them.
synth.addEventListener("voiceschanged", populateVoiceList);

// Call it once in case the voices are already loaded on page load
populateVoiceList();

// Function to convert text to speech
function textToSpeech(text) {
    // 1. Create a new Utterance object with the text
    let utterance = new SpeechSynthesisUtterance(text);
    
    // 2. Find the selected voice and assign it to the utterance
    for (let voice of synth.getVoices()) {
        if (voice.name === voiceList.value) {
            utterance.voice = voice;
            break; 
        }
    }
    
    // 3. Set event listeners for button text feedback
    utterance.onstart = () => {
        speechBtn.innerText = "Speaking...";
        speechBtn.disabled = true; // Disable while speaking
    };
    
    utterance.onend = () => {
        speechBtn.innerText = "Convert To Speech";
        speechBtn.disabled = false; // Enable when finished
    };

    // 4. Start the speech!
    synth.speak(utterance);
}

// Event listener for the main button
speechBtn.addEventListener("click", e => {
    e.preventDefault(); // Prevents form submission
    
    // Only proceed if there is text in the box
    if (textarea.value.trim() !== "") {
        // If the speech is already running, cancel it before starting new speech
        if (synth.speaking) {
             synth.cancel(); 
        }
        textToSpeech(textarea.value);
    }
});
