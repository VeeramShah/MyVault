let vaultData = { passwords: [], websites: [] };
let currentPassword = "";
let editIndex = -1;

async function unlockVault() {
    const passInput = document.getElementById('masterPassword');
    const fileInput = document.getElementById('importFile');
    currentPassword = passInput.value;

    if (!currentPassword) return alert("Enter a password!");

    if (fileInput.files.length > 0) {
        // Load existing file
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const decrypted = await decryptData(e.target.result, currentPassword);
                vaultData = JSON.parse(decrypted);
                showApp();
            } catch (err) { alert("Wrong password or corrupted file!"); }
        };
        reader.readAsText(fileInput.files[0]);
    } else {
        // New Vault
        if (confirm("No file selected. Create a new empty vault?")) showApp();
    }
}

function showApp() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    renderVault();
    renderWebsites();
    
    startAutoLogout();
}

// VAULT LOGIC
function addAccount() {
    const acc = {
        name: document.getElementById('accName').value,
        user: document.getElementById('accUser').value,
        pass: document.getElementById('accPass').value,
        desc: document.getElementById('accDesc').value,
        where: document.getElementById('accWhere').value
    };

    if (!acc.name || !acc.pass) return alert("Fill Name and Password!");

    // CHECK IF EDITING OR ADDING
    if (editIndex > -1) {
        vaultData.passwords[editIndex] = acc; // Update existing
        editIndex = -1; // Reset mode
        document.querySelector('#vault .primary-btn').innerText = "Add to Vault";
    } else {
        vaultData.passwords.push(acc); // Add new
    }
    
    renderVault();
    // Clear inputs
    document.querySelectorAll('#vault input').forEach(i => i.value = "");
}

// NEW FUNCTION: Populates the form with existing data
function editAccount(index) {
    const acc = vaultData.passwords[index];
    document.getElementById('accName').value = acc.name;
    document.getElementById('accUser').value = acc.user;
    document.getElementById('accPass').value = acc.pass;
    document.getElementById('accDesc').value = acc.desc || "";
    document.getElementById('accWhere').value = acc.where;
    
    editIndex = index;
    document.querySelector('#vault .primary-btn').innerText = "Update Account";
}

function renderVault() {
    const list = document.getElementById('vaultList');
    const search = document.getElementById('searchVault').value.toLowerCase();
    list.innerHTML = "";
    
    vaultData.passwords.forEach((item, index) => {
        if (item.name.toLowerCase().includes(search)) {
            list.innerHTML += `
            <div class="item-card">
                <div class="card-header">
                    <strong style="font-size: 1.1em; color: var(--primary);">${item.name}</strong>
                    <span class="tag">${item.where}</span>
                </div>
                <p class="desc-text">${item.desc || ''}</p>
                
                <div class="credential-row">
                    <span>User: <strong>${item.user}</strong></span>
                </div>
                
                <div class="credential-row" style="margin-top: 10px;">
                    <span id="pass-${index}" class="hidden-password">••••••••</span>
                    <div style="display:flex; gap: 5px; margin-left: auto;">
                        <button class="toggle-btn" onclick="togglePasswordVisibility(${index}, '${item.pass}')">Show</button>
                        <button class="copy-btn" onclick="copyToClipboard('${item.pass}')">Copy</button>
                    </div>
                </div>
                
                <div class="card-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="edit-btn" onclick="editAccount(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem('passwords', ${index})" style="flex:1;">Delete</button>
                </div>
            </div>`;
        }
    });
}

// WEBSITE LOGIC
function addWebsite() {
    const web = {
        name: document.getElementById('webName').value,
        url: document.getElementById('webUrl').value,
        cat: document.getElementById('webCat').value,
        desc: document.getElementById('webDesc').value
    };

    if (!web.name || !web.url || !web.cat) return alert("Fill Name, URL, and Category!");

    // CHECK IF EDITING OR ADDING
    if (editIndex > -1) {
        vaultData.websites[editIndex] = web;
        editIndex = -1;
        document.querySelector('#websites .primary-btn').innerText = "Save Website";
    } else {
        vaultData.websites.push(web);
    }
    
    renderWebsites();
    // Clear inputs
    document.querySelectorAll('#websites input, #websites select').forEach(i => i.value = "");
}

// NEW FUNCTION: Populates form with website data
function editWebsite(index) {
    const web = vaultData.websites[index];
    document.getElementById('webName').value = web.name;
    document.getElementById('webUrl').value = web.url;
    document.getElementById('webCat').value = web.cat;
    document.getElementById('webDesc').value = web.desc || "";
    
    editIndex = index;
    document.querySelector('#websites .primary-btn').innerText = "Update Website";
}

function renderWebsites() {
    const list = document.getElementById('websiteList');
    const search = document.getElementById('searchWeb').value.toLowerCase();
    list.innerHTML = "";

    vaultData.websites.forEach((item, index) => {
        if (item.name.toLowerCase().includes(search) || item.cat.toLowerCase().includes(search)) {
            list.innerHTML += ` 
            <div class="item-card">
                <div class="card-header">
                    <strong style="color: var(--primary); font-size: 1.1em;">${item.name}</strong>
                    <span class="tag">${item.cat}</span>
                </div>
                <p style="font-size: 0.9em; color: #888; margin: 5px 0 10px 0;">${item.desc || 'No description'}</p>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
                    <a href="${item.url}" target="_blank" class="accent-link">🔗 Visit</a>
                    <button class="copy-btn" onclick="copyToClipboard('${item.url}')">Copy URL</button>
                </div>
                <div class="card-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="edit-btn" onclick="editWebsite(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem('websites', ${index})" style="flex:1;">Delete</button>
                </div>
            </div>`;
        }
    });
}

function deleteItem(type, index) {
    vaultData[type].splice(index, 1);
    type === 'passwords' ? renderVault() : renderWebsites();
}

function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tab).style.display = 'block';
    event.target.classList.add('active');
}

// CRITICAL: THE SAVE FUNCTION
async function exportData() {
    const encryptedStr = await encryptData(JSON.stringify(vaultData), currentPassword);
    const blob = new Blob([encryptedStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "my_vault_data.json";
    a.click();
}

// Function to reveal/hide the password
function togglePasswordVisibility(index, actualPassword) {
    const passSpan = document.getElementById(`pass-${index}`);
    const btn = event.target;

    if (passSpan.innerText === '••••••••') {
        passSpan.innerText = actualPassword;
        btn.innerText = 'Hide';
    } else {
        passSpan.innerText = '••••••••';
        btn.innerText = 'Show';
    }
}

// Added a Copy feature for convenience
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    });
}

// --- LOGIN SCREEN FEATURES ---

// 1. Toggle Password Visibility (Eye Icon)
function toggleLoginPass(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

// 2. Switch between Unlock and Change Password modes
function toggleMode() {
    const unlockMode = document.getElementById('unlock-mode');
    const changeMode = document.getElementById('change-mode');
    
    if (unlockMode.style.display === "none") {
        unlockMode.style.display = "block";
        changeMode.style.display = "none";
    } else {
        unlockMode.style.display = "none";
        changeMode.style.display = "block";
    }
}

// 3. Logic to Change Master Password
function performPasswordChange() {
    const fileInput = document.getElementById('changeFile');
    const oldPass = document.getElementById('oldPass').value;
    const newPass = document.getElementById('newPass').value;

    if (fileInput.files.length === 0) return alert("Please select your current data file!");
    if (!oldPass || !newPass) return alert("Please fill in both passwords!");

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            // Step 1: Try to unlock with OLD password
            const decrypted = await decryptData(e.target.result, oldPass);
            const data = JSON.parse(decrypted);

            // Step 2: Re-encrypt with NEW password
            const encryptedStr = await encryptData(JSON.stringify(data), newPass);
            
            // Step 3: Download immediately
            const blob = new Blob([encryptedStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "my_vault_NEW_PASSWORD.json";
            a.click();
            
            alert("Success! Your password has been changed.\n\nIMPORTANT: Delete your old file and use the new downloaded file.");
            location.reload(); // Refresh to go back to start
            
        } catch (err) {
            alert("Incorrect 'Current Password'. Cannot decrypt file.");
        }
    };
    reader.readAsText(fileInput.files[0]);
}


// --- LOGOUT & SECURITY SYSTEM ---

let logoutTimer;

function startAutoLogout() {
    // Stop any existing timer first
    clearTimeout(logoutTimer);
    
    // Set interactions that reset the timer
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // Catches touchscreen taps too
    window.onkeydown = resetTimer;
    window.onscroll = resetTimer;
}

function resetTimer() {
    // Only run this if the vault is actually open
    if (document.getElementById('mainContent').style.display === 'block') {
        clearTimeout(logoutTimer);
        // Set timer for 2 minutes (2 * 60 * 1000 milliseconds)
        logoutTimer = setTimeout(logout, 2 * 60 * 1000); 
    }
}

function logout() {
    // 1. Clear sensitive data from memory
    vaultData = { passwords: [], websites: [] };
    currentPassword = "";
    
    // 2. Clear the UI lists
    document.getElementById('vaultList').innerHTML = "";
    document.getElementById('websiteList').innerHTML = "";
    
    // 3. Hide App, Show Login
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    
    // 4. Reset Inputs
    document.getElementById('masterPassword').value = "";
    document.getElementById('importFile').value = ""; // Clear file selection
    
    // 5. Show Feedback
    alert("Vault locked due to inactivity or logout.");
}