declare global {
    interface Window {
        token: string;
    }
}
// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', (event) => {
    if (event.data.action === 'storeToken') {
        // eslint-disable-next-line no-restricted-globals
        self.token = event.data.token;
    } else if (event.data.action === 'getToken') {
        // eslint-disable-next-line no-restricted-globals
        self.postMessage({ token: self.token });
    }
});

export {};
// // Crea una nueva instancia del worker
// const oauthWorker = new Worker('./oauthWorker.ts');
//
// // Almacena el token en el worker
// oauthWorker.postMessage({ action: 'storeToken', token: 'your-oauth-token' });
//
// // Recupera el token del worker
// oauthWorker.postMessage({ action: 'getToken' });
// oauthWorker.onmessage = (event) => console.log(event.data.token);