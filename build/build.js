import { 
    checkAuth, 
    getCharacter,
    logout, 
    createCharacter,
    // updateBottom,
    // updateHead,
    // updateMiddle,
    // updateCatchphrases,
    updateCharacter
} from '../fetch-utils.js';

checkAuth();

const headDropdown = document.getElementById('head-dropdown');
const middleDropdown = document.getElementById('middle-dropdown');
const bottomDropdown = document.getElementById('bottom-dropdown');
const headEl = document.getElementById('head');
const middleEl = document.getElementById('middle');
const bottomEl = document.getElementById('bottom');
const reportEl = document.getElementById('report');
const catchphrasesEl = document.getElementById('catchphrases');
const catchphraseInput = document.getElementById('catchphrase-input');
const catchphraseButton = document.getElementById('catchphrase-button');
const logoutButton = document.getElementById('logout');

// we're still keeping track of 'this session' clicks, so we keep these lets
let headCount = 0;
let middleCount = 0;
let bottomCount = 0;

let characterId;

headDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    headCount++;

    // update the head in supabase with the correct data
    // await updateHead(headDropdown.value);
    await updateCharacter(characterId, 'head', headDropdown.value);

    refreshData();
});


middleDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    middleCount++;
    
    // update the middle in supabase with the correct data
    // await updateMiddle(middleDropdown.value);
    await updateCharacter(characterId, 'middle', middleDropdown.value);

    refreshData();
});


bottomDropdown.addEventListener('change', async() => {
    // increment the correct count in state
    bottomCount++;
    
    // update the bottom in supabase with the correct data
    // await updateBottom(bottomDropdown.value);
    await updateCharacter(characterId, 'bottom', bottomDropdown.value);

    refreshData();
});

catchphraseButton.addEventListener('click', async() => {
    //grab the user input catchphrase
    const newCatchphrase = catchphraseInput.value;

    // go fetch the old catch phrases (living in the character object)
    const currentCharacter = await getCharacter();

    // our returned character object has an array of catchphrases living on it
	//push the new crachphrase to an array of all the existing catchphrases
    currentCharacter.catchphrases.push(newCatchphrase);

    // update the catchphrases in supabase by passing the mutated array to the updateCatchphrases function
    // await updateCatchphrases(currentCharacter.catchphrases);
    await updateCharacter(characterId, 'catchphrases', currentCharacter.catchphrases);

    //clear the input field
    catchphraseInput.value = '';



    refreshData();
});

window.addEventListener('load', async() => {
    // on load, attempt to fetch this user's character
    const character = await getCharacter();

    
    //STRETCH - update the form values to the correct values on load
    // if the user does have a character
    if (character) {
        headDropdown.value = character.head;
        middleDropdown.value = character.middle;
        bottomDropdown.value = character.bottom;

        //store the character id in state so you can pass it as variable to use match in update later
        characterId = character.id;
    }

    // if this user turns out not to have a character
    if (!character) {
        // create a new character with correct defaults for all properties (head, middle, bottom, catchphrases)
        const defaultCharacterSettings = { 
            head: 'dog', 
            middle: 'pink', 
            bottom: 'white', 
            catchphrases: [] 
        };

        const defaultCharacter = await createCharacter(defaultCharacterSettings);

        //store the character id in state so you can pass it as variable to use match in update later
        characterId = defaultCharacter.id;

    //STRETCH - update the form values to the correct values on load if there is no character and it creates a default
        headDropdown.value = defaultCharacter.head;
        middleDropdown.value = defaultCharacter.middle;
        bottomDropdown.value = defaultCharacter.bottom;
    }

    // then call the refreshData function to set the DOM with the updated data
    refreshData();
});

logoutButton.addEventListener('click', () => {
    logout();
});

function refreshData() {
    displayStats();
    fetchAndDisplayCharacter();
}

function displayStats() {
    reportEl.textContent = `In this session, you have changed the head ${headCount} times, the body ${middleCount} times, and the pants ${bottomCount} times. And nobody can forget your character's classic catchphrases:`;
}


async function fetchAndDisplayCharacter() {
    // fetch the character from supabase
    const currentCharacter = await getCharacter();

    // if the character has a head, display the head in the dom
    if (currentCharacter.head) headEl.style.backgroundImage = `url(../assets/${currentCharacter.head}-head.png)`;
    
    // if the character has a middle, display the middle in the dom
    if (currentCharacter.middle) middleEl.style.backgroundImage = `url('../assets/${currentCharacter.middle}-middle.png')`;
    
    // if the character has a pants, display the pants in the dom
    if (currentCharacter.bottom) bottomEl.style.backgroundImage = `url('../assets/${currentCharacter.bottom}-pants.png')`;

    // loop through catchphrases and display them to the dom (clearing out old dom if necessary)
    catchphrasesEl.textContent = '';
    for (let catchphrase of currentCharacter.catchphrases) {
        const p = document.createElement('p');
        p.textContent = catchphrase;
        p.classList.add('catchphrase');
        catchphrasesEl.append(p);
    }

}

