import React, {useState} from 'react';
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <div className="homeFormHeader">
                    <img
                        className="homePageLogo"
                        src="/logo.png"
                        alt="CollabCode Panel"
                    />
                    <h4 className="mainLabel">
                        Generate a new room or paste your invitation ROOM ID
                    </h4>
                </div>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                        autoComplete="username"
                        spellCheck={false}
                    />
                    <button type="button" className="btn joinBtn" onClick={joinRoom}>
                        Join room
                    </button>
                    <span className="createInfo">
                        No invite?{' '}
                        <button
                            type="button"
                            className="createNewBtn"
                            onClick={createNewRoom}
                        >
                            Create new room
                        </button>
                    </span>
                </div>
            </div>
            <footer className="homeFooter">
                <h4>Built by Halit Altun</h4>
            </footer>
        </div>
    );
};

export default Home;