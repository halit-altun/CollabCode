import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import {RecoilRoot} from "recoil";

function App() {

    return (
        <>
            <div>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 3200,
                        style: {
                            background: '#282a36',
                            color: '#eef0f5',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#4aed88',
                                secondary: '#1c1e29',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#1c1e29',
                            },
                        },
                    }}
                />
            </div>
            <BrowserRouter>
                <RecoilRoot>
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route
                            path="/editor/:roomId"
                            element={<EditorPage />}
                        ></Route>
                    </Routes>
                </RecoilRoot>
            </BrowserRouter>
        </>
    );
}

export default App;