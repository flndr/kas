import React    from 'react';
import ReactDOM from 'react-dom';

import 'typeface-jetbrains-mono';
import 'typeface-vt323';
import './rsuite.css';
import './index.css';

import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById( 'root' )
);
