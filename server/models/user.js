const users = []

function userLeave(id) {
    const index = users.findIndex(user => user.id ===id)
    if(index !== -1) return users.splice(index,1)[0]
}

function roomUsers(roomId) {
    return users.filter(user => user.roomId===roomId)
}

function findUser(id) {
    const index = users.findIndex(user => user.id===id)
    if(index !== -1) return users[index]
}

function opponentOf(socket_id) {
    const user = findUser(socket_id)
    if(user) {
        const users = roomUsers(user.roomId)
        return users.filter(user => user.id !== socket_id)[0]
    }
}

module.exports = {users,userLeave,roomUsers,findUser,opponentOf}