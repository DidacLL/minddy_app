import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {i18n} from "@lingui/core";
import {I18nProvider} from "@lingui/react";
import {messages} from "./locales/en/messages";

i18n.load("en", messages);
i18n.activate("en");
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <I18nProvider i18n={i18n}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </I18nProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
