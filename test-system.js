const { io } = require('./client/node_modules/socket.io-client');

const BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

async function testSystem() {
    console.log('🚀 Starting System Test (enhanced)...');

    try {
        // 1. Register User A
        console.log('📝 Registering/Logging in User A...');
        const userA_data = {
            name: 'User A',
            email: 'usera@test.com',
            password: 'password123',
            gender: 'male',
            lookingFor: 'both',
            age: 25,
            location: { type: 'Point', coordinates: [72.8777, 19.0760] }
        };
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userA_data)
        });

        const loginARes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'usera@test.com', password: 'password123' })
        });
        const loginA = await loginARes.json();
        const tokenA = loginA.accessToken;
        const idA = loginA.data._id;
        console.log('✅ User A ready, ID:', idA);

        // 2. Register User B
        console.log('📝 Registering/Logging in User B...');
        const userB_data = {
            name: 'User B',
            email: 'userb@test.com',
            password: 'password123',
            gender: 'female',
            lookingFor: 'both',
            age: 24,
            location: { type: 'Point', coordinates: [72.8778, 19.0761] }
        };
        await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userB_data)
        });

        const loginBRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'userb@test.com', password: 'password123' })
        });
        const loginB = await loginBRes.json();
        const tokenB = loginB.accessToken;
        const idB = loginB.data._id;
        console.log('✅ User B ready, ID:', idB);

        // 3. Find or Create Room
        let roomId;
        console.log('� Checking for existing chat room...');
        const roomsFetch = await fetch(`${BASE_URL}/chat-rooms/my-chat-rooms`, {
            headers: { 'Authorization': `Bearer ${tokenA}` }
        });
        const roomsData = await roomsFetch.json();
        const existingRoom = roomsData.find(r => r.participants.some(p => p._id === idB));

        if (existingRoom) {
            roomId = existingRoom._id;
            console.log('✅ Existing Room found:', roomId);
        } else {
            console.log('💌 Sending chat request...');
            const reqResFetch = await fetch(`${BASE_URL}/chat-requests/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenA}`
                },
                body: JSON.stringify({ receiverId: idB })
            });
            const reqRes = await reqResFetch.json();

            console.log('🔍 Fetching User B requests...');
            const getReqsFetch = await fetch(`${BASE_URL}/chat-requests/my-requests`, {
                headers: { 'Authorization': `Bearer ${tokenB}` }
            });
            const allReqs = await getReqsFetch.json();
            const pendingReq = allReqs.data.find(r => r.sender._id === idA && r.status === 'pending');

            if (pendingReq) {
                console.log('🤝 Accepting request:', pendingReq._id);
                const acceptResFetch = await fetch(`${BASE_URL}/chat-requests/respond`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenB}`
                    },
                    body: JSON.stringify({ requestId: pendingReq._id, status: 'accepted' })
                });
                const acceptRes = await acceptResFetch.json();
                roomId = acceptRes.chatRoom._id;
                console.log('✅ Room created:', roomId);
            }
        }

        if (!roomId) throw new Error('Could not establish a chat room');

        // 4. Test Real-time Messaging (Socket.io)
        console.log('🔌 Connecting Sockets...');
        const socketA = io(SOCKET_URL, { auth: { token: tokenA } });
        const socketB = io(SOCKET_URL, { auth: { token: tokenB } });

        await new Promise((resolve, reject) => {
            let connectedCount = 0;
            const timeout = setTimeout(() => reject(new Error('Socket connection timeout')), 5000);
            const check = () => {
                connectedCount++;
                if (connectedCount === 2) {
                    clearTimeout(timeout);
                    resolve();
                }
            };
            socketA.on('connect', check);
            socketB.on('connect', check);
        });
        console.log('✅ Both sockets connected');

        // User B listens for message
        const messageReceivedPromise = new Promise((resolve) => {
            socketB.on('receive_message', (data) => {
                console.log('📥 User B received message:', data.content);
                resolve(data);
            });
        });

        // User A sends message
        console.log('📤 User A sending message...');
        socketA.emit('send_message', {
            messageId: 'test-msg-' + Date.now(),
            roomId: roomId,
            content: 'Hello User B! This is an enhanced system test.'
        });

        const receivedMsg = await messageReceivedPromise;
        if (receivedMsg.content === 'Hello User B! This is an enhanced system test.') {
            console.log('🎉 REAL-TIME MESSAGING SUCCESSFUL!');
        } else {
            console.log('❌ Message content mismatch!');
        }

        // 5. Test Typing Indicator
        const typingStartedPromise = new Promise((resolve) => {
            socketB.on('typing-started', (data) => {
                console.log('⌨️ User B saw User A typing');
                resolve(data);
            });
        });

        console.log('⌨️ User A starting to type...');
        socketA.emit('typing_start', { receiverId: idB });
        await typingStartedPromise;

        socketA.disconnect();
        socketB.disconnect();

        console.log('🏁 ENHANCED SYSTEM TEST COMPLETED SUCCESSFULLY!');
        process.exit(0);

    } catch (error) {
        console.error('❌ SYSTEM TEST FAILED!');
        console.error('Error:', error.stack || error.message);
        process.exit(1);
    }
}

testSystem();
