let vaultData = { passwords: [], websites: [] };
let currentPassword = "";

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
        if(confirm("No file selected. Create a new empty vault?")) showApp();
    }
}

function showApp() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    renderVault();
    renderWebsites();
}

// VAULT LOGIC
function addAccount() {
    const acc = {
        name: document.getElementById('accName').value,
        user: document.getElementById('accUser').value,
        pass: document.getElementById('accPass').value,
        where: document.getElementById('accWhere').value
    };
    vaultData.passwords.push(acc);
    renderVault();
}

function renderVault() {
    const list = document.getElementById('vaultList');
    const search = document.getElementById('searchVault').value.toLowerCase();
    list.innerHTML = "";
    vaultData.passwords.forEach((item, index) => {
        if(item.name.toLowerCase().includes(search)) {
            list.innerHTML += `<div class="item-card">
                <strong>${item.name}</strong><br>
                User: ${item.user} | Pass: <code>${item.pass}</code><br>
                <small>Used at: ${item.where}</small><br>
                <button class="delete-btn" onclick="deleteItem('passwords', ${index})">Delete</button>
            </div>`;
        }
    });
}

// WEBSITE LOGIC
function addWebsite() {
    const web = {
        name: document.getElementById('webName').value,
        url: document.getElementById('webUrl').value,
        cat: document.getElementById('webCat').value
    };
    vaultData.websites.push(web);
    renderWebsites();
}

function renderWebsites() {
    const list = document.getElementById('websiteList');
    const search = document.getElementById('searchWeb').value.toLowerCase();
    list.innerHTML = "";
    vaultData.websites.forEach((item, index) => {
        if(item.name.toLowerCase().includes(search)) {
            list.innerHTML += `<div class="item-card">
                <strong>${item.name}</strong> [${item.cat}]<br>
                <a href="${item.url}" target="_blank" style="color: #c3e88d">${item.url}</a><br>
                <button class="delete-btn" onclick="deleteItem('websites', ${index})">Delete</button>
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

function addAccount() {
    const acc = {
        name: document.getElementById('accName').value,
        user: document.getElementById('accUser').value,
        pass: document.getElementById('accPass').value,
        desc: document.getElementById('accDesc').value, // NEW FIELD
        where: document.getElementById('accWhere').value
    };
    
    if(!acc.name || !acc.pass) return alert("Fill Name and Password!");
    
    vaultData.passwords.push(acc);
    renderVault();
    
    // Clear inputs after adding
    document.querySelectorAll('#vault .form-group input').forEach(i => i.value = "");
}

function renderVault() {
    const list = document.getElementById('vaultList');
    const search = document.getElementById('searchVault').value.toLowerCase();
    list.innerHTML = "";
    
    vaultData.passwords.forEach((item, index) => {
        if(item.name.toLowerCase().includes(search) || item.desc.toLowerCase().includes(search)) {
            list.innerHTML += `
            <div class="item-card">
                <div class="card-header">
                    <strong style="font-size: 1.1em; color: var(--primary);">${item.name}</strong>
                    <span class="tag">${item.where}</span>
                </div>
                <p style="font-size: 0.9em; color: #888; margin: 5px 0 15px 0;">${item.desc}</p>
                
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
                
                <button class="delete-btn" onclick="deleteItem('passwords', ${index})" style="width: 100%; margin-top: 15px;">Delete Entry</button>
            </div>`;
        }
    });
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
        const btn = event.target;
        const oldText = btn.innerText;
        btn.innerText = "✓";
        setTimeout(() => btn.innerText = oldText, 1000);
    });
}