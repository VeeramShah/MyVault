# MyVault 🔒
**Personal Offline Password Vault & Website Saver**

MyVault is a secure, 100% offline application designed to run directly from a pendrive. It allows you to store passwords and save website links without any internet connection, cloud servers, or databases. Your data is encrypted using military-grade **AES-GCM encryption**.

---

## 🚀 Getting Started (First Time Users)

Since this app works offline, it does not "sign you up" like a normal website. You create your own vault file.

1.  **Open the App**: Double-click `index.html` to open it in your browser (Chrome, Edge, Firefox, etc.).
2.  **Create Master Password**: 
    * You will see the "Unlock Vault" screen.
    * **Do not** select any file yet.
    * Type a strong **Master Password** in the box.
    * Click **Unlock Vault**.
3.  **Confirm Creation**: A popup will ask: *"No file selected. Create a new empty vault?"* Click **OK**.
4.  **Save Immediately**: 
    * The vault is now open but empty.
    * Click the green **DOWNLOAD UPDATED VAULT** button immediately.
    * A file named `my_vault_data.json` will download.
    * **Move this file** into the `data/` folder on your pendrive.
    * *This is your secure database. Do not lose it!*

---

## 🔓 How to Unlock Your Vault
1.  Open `index.html`.
2.  Click the **Choose File** button under "Load data file".
3.  Select your `my_vault_data.json` file from the `data/` folder.
4.  Enter your **Master Password**.
5.  Click **Unlock Vault**.

---

## 💾 How to Save Changes (CRITICAL STEP)
**Important:** Because this app is offline and has no server, **it cannot auto-save** to your hard drive. You must manually save changes.

1.  Add a new Password or Website, or Edit/Delete an existing one.
2.  **After you are done making changes**, click the big green button:  
    **💾 DOWNLOAD UPDATED VAULT**
3.  A new `my_vault_data.json` file will download.
4.  **Replace** the old file in your `data/` folder with this new one.
    * *Tip: Delete the old one first to avoid confusion.*

---

## 🛠 Features

### 🔑 Password Vault
* **Add Accounts**: Store Username, Password, and "Where used".
* **Security**: Passwords are hidden by default (`••••••`).
* **Show/Hide**: Click the **Show** button to reveal.
* **Copy**: Click **Copy** to copy directly to clipboard without revealing.
* **Edit**: Update account details easily.

### 🌐 Website Saver
* **Organize**: Save tools by category (AI, Coding, Social, etc.).
* **Direct Links**: Click **Visit** to open the site.
* **Copy URL**: Quickly copy the link to share.
* **Descriptions**: Add notes about what the tool does.

### 🛡️ Security Features
* **Auto-Logout**: If you are inactive for **2 minutes**, the vault automatically locks.
* **Manual Logout**: Click the red **Log Out ⏻** button at the top right.
* **AES Encryption**: Your `json` file looks like scrambled garbage to anyone without the password.

---

## 🔄 How to Change Your Master Password
If you want to change your password, you must re-encrypt your file.

1.  On the Login Screen, click the link: **"Want to change your password? Click here"**.
2.  **Select File**: Choose your current `my_vault_data.json`.
3.  **Old Password**: Enter your *current* password to prove it's you.
4.  **New Password**: Enter the *new* password you want.
5.  Click **Update & Download**.
6.  **IMPORTANT**: A new file will download. You **MUST** replace your old file on the pendrive with this new one. The old file will still require the old password.

---

## ⚠️ Important Warnings
* **No "Forgot Password"**: There is no reset link. If you forget your Master Password, your data is lost forever.
* **Backups**: Copy your `my_vault_data.json` to a second pendrive or secure location occasionally.
* **Browser Cache**: Since this runs in a browser, do not run it on public computers (like cyber cafes) unless you trust the machine.

---

## 💻 Tech Stack
* **HTML5** (Structure)
* **CSS3** (Cyber-Dark Aesthetic, Grid/Flexbox)
* **JavaScript** (Logic, AES-GCM Encryption, File Handling)
* **No External Libraries**: 100% pure code.