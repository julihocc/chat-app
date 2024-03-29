const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class ChatAPI extends RESTDataSource {
	constructor(options) {
        super(options);
        this.baseURL = process.env.CHAT_SERVICE_URL || 'http://localhost:4500';
    }
	async getChatRoomById(chatRoomId) {
		debug("getChatRoomById")
		debug(`chatRoomId: ${chatRoomId}`);

		const params = {chatRoomId}
		const data = await this.get("/v1/chat-room", {params})
		debug(`ChatAPI | getChatRoomById | data: ${JSON.stringify(data)}`);
		return data;
	}

	async getChatRoomByIdPopulatedWithUsers(chatRoomId) {
		debug("getChatRoomByIdPopulatedWithUsers")
        debug(`chatRoomId: ${chatRoomId}`);

		const params = {chatRoomId}
		const data = await this.get("/v1/chat-room-populated", {params})
		debug(`ChatAPI | getChatRoomByIdPopulatedWithUsers | data: ${JSON.stringify(data)}`);

        return data;
	}

	async getMessagesByChatRoomId(chatRoomId) {
		debug("getMessagesByChatRoomId",)
		debug(`chatRoomId: ${chatRoomId}`);

		const params = {chatRoomId}
		const data = await this.get("/v1/messages", {params})

		return data;
	}

	async saveMessage(chatRoomId, senderId, body, fileContent) {
		debug("saveMessage")
        debug(`chatRoomId: ${chatRoomId}`)
        debug(`senderId: ${senderId}`)
        debug(`body: ${body}`)

        const data = await this.post("/v1/message", {
            body: {
                chatRoomId,
                senderId,
                body,
                fileContent
            }
        })
		debug(`ChatAPI | saveMessage | data: ${JSON.stringify(data)}`);
        return data;
	}

	async getChatRoomByParticipantIds(participantIds) {
		debug("getChatRoomByParticipantIds")
        debug(`participantIds: ${participantIds}`);

		const params = {participantIds}
        const data = await this.get("/v1/chat-room", {params})
        debug(`ChatAPI | getChatRoomByParticipantIds | data: ${JSON.stringify(data)}`);

        return data;
	}

	async createChatRoomWithParticipantIds(participantIds) {
		debug("ChatAPI | createChatRoomWithParticipantIds")
        debug(`participantIds: ${participantIds}`);

        const data = await this.post("/v1/chat-room", {
            body: {
                participantIds
            }
        })
        debug(`ChatAPI | createChatRoomWithParticipantIds | data: ${JSON.stringify(data)}`);
        return data;
	}

	async createUser(_id, email, username) {
		debug("ChatAPIT | createUser")
        debug(`_id: ${_id}`)
        debug(`email: ${email}`)
        debug(`username: ${username}`)

        const data = await this.post("/v1/user", {
            body: {
                _id,
                email,
                username
            }
        })
        debug(`createUser/data: ${JSON.stringify(data)}`);
        return data;
	}

	async changeUsername(username, newUsername) {
		debug("ChatAPIT | updateUser")
        debug(`username: ${username}`)
        debug(`newUsername: ${newUsername}`)

        const data = await this.put("/v1/user", {
            body: {
                username,
                newUsername
            }
        })
        debug(`updateUser/data: ${JSON.stringify(data)}`);
        return data;
	}

	async getChatRoomsByUserId(userId) {
		debug("ChatAPI | getChatRoomsForCurrentUser")
		debug(`userId: ${userId}`);
		const data = await this.get("/v1/search", {
            params: {
                userId
            }
        })
		debug(`ChatAPI | getChatRoomsForCurrentUser | data: ${JSON.stringify(data)}`);
		return data;
	}
}

module.exports = {ChatAPI};