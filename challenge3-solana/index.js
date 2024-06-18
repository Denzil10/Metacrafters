// app.js

const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const addressDiv = document.getElementById('address');

let provider = null;

const getProvider = () => {
    if ('solana' in window) {
        const anyWindow = window;
        const provider = anyWindow.solana;

        if (provider.isPhantom) {
            return provider;
        }
    }
    window.open('https://phantom.app/', '_blank');
};

const connectWallet = async () => {
    provider = getProvider();

    if (provider) {
        try {
            await provider.connect();
            const { publicKey } = provider;
            addressDiv.textContent = `Connected account: ${publicKey.toString()}`;
            addressDiv.style.display = 'block';
            connectButton.style.display = 'none';
            disconnectButton.style.display = 'block';
        } catch (err) {
            console.error('Connection failed!', err);
        }
    }
};

const disconnectWallet = async () => {
    if (provider) {
        try {
            await provider.disconnect();
            addressDiv.textContent = '';
            addressDiv.style.display = 'none';
            connectButton.style.display = 'block';
            disconnectButton.style.display = 'none';
        } catch (err) {
            console.error('Disconnection failed!', err);
        }
    }
};

connectButton.addEventListener('click', connectWallet);
disconnectButton.addEventListener('click', disconnectWallet);

window.onload = () => {
    provider = getProvider();
};
