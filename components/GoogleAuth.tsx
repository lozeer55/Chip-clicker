import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SaveState } from '../types';

// These would typically be in a .env file, but are hardcoded here for this environment.
// It is assumed that process.env.GOOGLE_CLIENT_ID and process.env.API_KEY are available.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const API_KEY = process.env.API_KEY;

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';
const SAVE_FILE_NAME = 'elixir_clicker_save.json';

interface GoogleAuthProps {
    gameState: SaveState;
    onLoadGame: (state: SaveState) => void;
}

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

// FIX: Correctly typed the Google API client objects on the window interface to prevent TypeScript errors.
declare global {
    interface Window {
        google: any;
        gapi: any;
    }
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ gameState, onLoadGame }) => {
    const isConfigured = GOOGLE_CLIENT_ID && API_KEY && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID';

    useEffect(() => {
        if (!isConfigured) {
            console.warn("Google Auth is not configured due to missing GOOGLE_CLIENT_ID or API_KEY. The cloud sync feature is disabled.");
        }
    }, [isConfigured]);

    if (!isConfigured) {
        return (
            <div className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-400">
                Cloud Sync is not configured for this environment.
            </div>
        );
    }

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isGapiLoaded, setIsGapiLoaded] = useState(false);
    const [isGsiLoaded, setIsGsiLoaded] = useState(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    
    const tokenClient = useRef<any>(null);

    const loadGapiScript = useCallback(() => {
        if (window.gapi) {
            window.gapi.load('client', () => setIsGapiLoaded(true));
        }
    }, []);

    const loadGsiScript = useCallback(() => {
        if (window.google) {
            setIsGsiLoaded(true);
        }
    }, []);

    useEffect(() => {
        const gapiScript = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
        gapiScript?.addEventListener('load', loadGapiScript);

        const gsiScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        gsiScript?.addEventListener('load', loadGsiScript);
        
        // Handle cases where scripts might already be loaded
        if (window.gapi) loadGapiScript();
        if (window.google) loadGsiScript();

        return () => {
            gapiScript?.removeEventListener('load', loadGapiScript);
            gsiScript?.removeEventListener('load', loadGsiScript);
        };
    }, [loadGapiScript, loadGsiScript]);


    const initializeGapiClient = useCallback(async () => {
        // FIX: Replaced 'gapi' with 'window.gapi' to resolve "Cannot find name 'gapi'" error.
        await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOCS,
        });
    }, []);

    const initializeGsiClient = useCallback(() => {
        // FIX: Replaced 'google' with 'window.google' to resolve "Cannot find name 'google'" error.
        tokenClient.current = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: '', // The callback is handled by the promise in handleSignIn
        });
    }, []);

    useEffect(() => {
        if(isGapiLoaded) initializeGapiClient();
    }, [isGapiLoaded, initializeGapiClient]);

    useEffect(() => {
        if(isGsiLoaded) initializeGsiClient();
    }, [isGsiLoaded, initializeGsiClient]);

    const getFileId = async (): Promise<string | null> => {
        try {
            // FIX: Replaced 'gapi' with 'window.gapi' to resolve "Cannot find name 'gapi'" error.
            const response = await window.gapi.client.drive.files.list({
                spaces: 'appDataFolder',
                fields: 'files(id, name)',
                pageSize: 10
            });
            const files = response.result.files;
            const existingFile = files.find((file: any) => file.name === SAVE_FILE_NAME);
            return existingFile ? existingFile.id : null;
        } catch (e) {
            console.error("Error listing files", e);
            return null;
        }
    };

    const loadFromDrive = useCallback(async () => {
        setSyncStatus('syncing');
        const fileId = await getFileId();
        if (fileId) {
            try {
                // FIX: Replaced 'gapi' with 'window.gapi' to resolve "Cannot find name 'gapi'" error.
                const response = await window.gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                });
                const saveData: SaveState = JSON.parse(response.body);
                onLoadGame(saveData);
                setSyncStatus('synced');
            } catch (e) {
                console.error("Error loading save file:", e);
                setSyncStatus('error');
            }
        } else {
            console.log("No save file found in cloud.");
            setSyncStatus('synced'); // No file is a valid synced state
        }
    }, [onLoadGame]);

    const saveToDrive = useCallback(async (data: SaveState) => {
        if (!isSignedIn) return;
        setSyncStatus('syncing');

        const fileId = await getFileId();
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const metadata = {
            name: SAVE_FILE_NAME,
            mimeType: 'application/json',
        };

        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(data) +
            close_delim;

        const path = '/upload/drive/v3/files' + (fileId ? `/${fileId}` : '');
        const method = fileId ? 'PATCH' : 'POST';

        try {
            // FIX: Replaced 'gapi' with 'window.gapi' to resolve "Cannot find name 'gapi'" error.
            await window.gapi.client.request({
                path: path,
                method: method,
                params: { uploadType: 'multipart' },
                headers: { 'Content-Type': 'multipart/related; boundary="' + boundary + '"' },
                body: multipartRequestBody
            });
            setSyncStatus('synced');
        } catch (e) {
            console.error("Error saving to drive:", e);
            setSyncStatus('error');
        }
    }, [isSignedIn]);
    
    const handleSignIn = useCallback(() => {
        if (!tokenClient.current) return;
        
        tokenClient.current.callback = async (resp: any) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            setIsSignedIn(true);
            const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { 'Authorization': `Bearer ${resp.access_token}` }
            });
            const profile = await profileResponse.json();
            setUserProfile(profile);
            await loadFromDrive();
        };
        
        // FIX: Replaced 'gapi' with 'window.gapi' to resolve "Cannot find name 'gapi'" error.
        if (window.gapi.client.getToken() === null) {
            tokenClient.current.requestAccessToken({prompt: 'consent'});
        } else {
            tokenClient.current.requestAccessToken({prompt: ''});
        }
    }, [loadFromDrive]);

    const handleSignOut = useCallback(() => {
        // FIX: Replaced 'gapi' and 'google' with 'window.gapi' and 'window.google' to resolve "Cannot find name" errors.
        const token = window.gapi.client.getToken();
        if (token !== null) {
            window.google.accounts.oauth2.revoke(token.access_token, () => {
                window.gapi.client.setToken('');
                setIsSignedIn(false);
                setUserProfile(null);
                setSyncStatus('idle');
            });
        }
    }, []);

    const handleSave = useCallback(() => {
        saveToDrive(gameState);
    }, [saveToDrive, gameState]);

    const handleLoad = useCallback(() => {
        if (window.confirm("Loading from the cloud will overwrite your current local progress. Are you sure?")) {
            loadFromDrive();
        }
    }, [loadFromDrive]);

    if (!isGapiLoaded || !isGsiLoaded) {
        return <div className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-400">Loading Cloud Sync...</div>;
    }

    if (!isSignedIn) {
        return (
            <div className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg flex items-center justify-between">
                <p className="text-sm text-slate-300">Save your progress online.</p>
                <button 
                    onClick={handleSignIn} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256"><path d="M229.7,121.2c0-8-1-16.8-2.6-26.8H128v48h58.2c-2.4,14.6-9.8,26.5-21.4,34.4v30.9h39.8C220.5,212.9,229.7,171,229.7,121.2Z"/><path d="M128,232c27.1,0,49.8-8.8,66.4-23.9l-39.8-30.9c-9,6-20.7,9.6-34.6,9.6-26.6,0-49.2-18-57.2-42.2H28v32.5C47.2,213.2,84.4,232,128,232Z"/><path d="M70.8,142.9c-1.7-5.2-2.8-10.7-2.8-16.2s1.1-11,2.8-16.2V78H28C19.8,96.6,16,111.7,16,128c0,16.3,3.8,31.4,12,49.9Z"/><path d="M128,73.8c14.2,0,25.4,5.3,34.8,14.2l35.3-35.3C180.4,32.7,156.4,24,128,24,84.4,24,47.2,42.8,28,78l42.8,32.5C78.8,91.8,101.4,73.8,128,73.8Z"/></svg>
                    Sign in with Google
                </button>
            </div>
        );
    }
    
    const SyncIndicator = () => {
        let text: string;
        let color: string;

        if (syncStatus === 'syncing') {
            text = "Syncing...";
            color = "text-purple-400";
        } else if (syncStatus === 'synced') {
            text = "Synced";
            color = "text-pink-400";
        } else if (syncStatus === 'error') {
            text = "Sync Error";
            color = "text-red-400";
        } else { // This handles 'idle'
            text = "Ready";
            color = "text-slate-400";
        }
        return <span className={`text-xs font-semibold ${color}`}>{text}</span>;
    };

    return (
        <div className="p-3 bg-slate-700/50 border border-slate-600 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                    <img src={userProfile?.picture} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-500" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{userProfile?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{userProfile?.email}</p>
                    </div>
                </div>
                <button onClick={handleSignOut} className="flex-shrink-0 text-sm text-slate-300 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition-colors">
                    Sign Out
                </button>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-600 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-300">Cloud Status:</span>
                    <SyncIndicator />
                </div>
                <div className="flex gap-2 pt-2">
                    <button 
                        onClick={handleSave} 
                        disabled={syncStatus === 'syncing'}
                        className="flex-1 text-sm font-bold py-2 px-3 rounded-lg shadow-sm transition-all duration-150 active:scale-95 bg-pink-600 hover:bg-pink-700 text-white disabled:bg-slate-500 disabled:cursor-wait"
                    >
                        Save to Cloud
                    </button>
                    <button 
                        onClick={handleLoad} 
                        disabled={syncStatus === 'syncing'}
                        className="flex-1 text-sm font-bold py-2 px-3 rounded-lg shadow-sm transition-all duration-150 active:scale-95 bg-slate-600 hover:bg-slate-500 text-white disabled:bg-slate-500 disabled:cursor-wait"
                    >
                        Load from Cloud
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoogleAuth;