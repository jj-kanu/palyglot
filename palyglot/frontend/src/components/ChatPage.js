import React, { useEffect } from 'react';
import Chat from './Chat';
import Sidebar from './Sidebar';
import NavBar from './NavBar';
import '../css/App_Chat.css';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Pusher from 'pusher-js';

export default function ChatPage() {

    const { currentUser } = useAuth();
    const [currentRoom, setCurrentRoom] = React.useState("-1");
    const [rooms, setRooms] = React.useState([]);
    const [messages, setMessages] = React.useState([]);

    /* Get all of the user's conversations, set the focused conversation to the
     * latest conversation, and get the past messages for that conversation.
     */
    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        const pusher = new Pusher('a4e914a09d88628d31df', {
            cluster: 'us2'
        });

        const channel = pusher.subscribe('messages');
        channel.bind('updated', function (data) {
            console.log('updated');
            if (data.id === currentRoom) {
                setMessages([...messages, data.message]);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
        
    }, [messages, currentRoom]);

    function fetchData() {
        axios.get(`http://localhost:5000/users/${currentUser.uid}`)
            .then(res => {
                console.log("rooms are " + res.data.rooms);
                setRooms(res.data.rooms);
                if (res.data.rooms.length > 0) {
                    setCurrentRoom(res.data.rooms[0]);
                }
                if (res.data.rooms[0] !== "-1") {
                    axios.get(`http://localhost:5000/messages?roomId=${res.data.rooms[0]}`)
                        .then(res => {
                            setMessages(res.data);
                        })
                }
            })
    }

    function changeRoom(roomId) {
        getRoomMessages(roomId);
        setCurrentRoom(roomId);
    }

    function getRoomMessages(roomId) {
        axios.get(`http://localhost:5000/messages?roomId=${roomId}`)
            .then(res => {
                setMessages(res.data);
            })
    }

    return (
        <div className="App">
            <NavBar></NavBar>
            <div className="body">
                <Sidebar rooms={rooms} currentRoom={currentRoom}
                    onChangeRoom={changeRoom}>
                </Sidebar>
                <Chat room={currentRoom} messages={messages}></Chat>
            </div>
        </div>
    );
}
