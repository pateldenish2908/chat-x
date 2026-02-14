const SocketEvents = require('../../constants/socketEvents');

module.exports = (io, socket) => {
    const callUser = (data) => {
        console.log(`Call initiated from ${socket.data.userId} to ${data.userToCall}`);
        io.to(data.userToCall).emit(SocketEvents.CALL_MADE, {
            offer: data.offer,
            socket: socket.id,
            user: data.user,
            callType: data.callType
        });
    };

    const makeAnswer = (data) => {
        console.log(`Call answered by ${socket.data.userId} to ${data.to}`);
        socket.to(data.to).emit(SocketEvents.ANSWER_MADE, {
            socket: socket.id,
            answer: data.answer
        });
    };

    const iceCandidate = (data) => {
        socket.to(data.to).emit(SocketEvents.ICE_CANDIDATE, {
            candidate: data.candidate,
            from: socket.id
        });
    };

    const endCall = (data) => {
        console.log(`Call ended by ${socket.data.userId}`);
        if (data.to) {
            socket.to(data.to).emit(SocketEvents.END_CALL);
        }
    };

    socket.on(SocketEvents.CALL_USER, callUser);
    socket.on(SocketEvents.MAKE_ANSWER, makeAnswer);
    socket.on(SocketEvents.ICE_CANDIDATE, iceCandidate);
    socket.on(SocketEvents.END_CALL, endCall);
};
