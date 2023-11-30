const {RESTDataSource} = require("@apollo/datasource-rest");
const {debug} = require("../utils/logger");

class ChatAPI extends RESTDataSource {
	constructor(options) {
        super(options);
        this.baseURL = 'http://localhost:4500';
    }
	async getChatRoomById(chatRoomId) {
		debug("getChatRoomById")
		debug(`chatRoomId: ${chatRoomId}`);

		// const data = await this.post("/chat-service/getChatRoomById", {
        //     body: {
        //         chatRoomId
        //     }
        // })

		const params = {chatRoomId}
		const data = await this.get("/v1/chat-room-by-id", {params})
		debug(`ChatAPI | getChatRoomById | data: ${JSON.stringify(data)}`);
		return data;
	}

	async getChatRoomByIdPopulatedWithUsers(chatRoomId) {
		debug("getChatRoomByIdPopulatedWithUsers")
        debug(`chatRoomId: ${chatRoomId}`);

        // const data = await this.post("/chat-service/getChatRoomByIdPopulatedWithUsers", {
        //     body: {
        //         chatRoomId
        //     }
        // })

		const params = {chatRoomId}
		const data = await this.get("/v1/chat-room-by-id-populated-with-users", {params})
		debug(`ChatAPI | getChatRoomByIdPopulatedWithUsers | data: ${JSON.stringify(data)}`);

        return data;
	}

	async getMessagesByChatRoomId(chatRoomId) {
		debug("getMessagesByChatRoomId",)
		debug(`chatRoomId: ${chatRoomId}`);

		// const data = await this.post("/chat-service/getMessagesByChatRoomId", {
		// 	body: {
		// 		chatRoomId
		// 	}
		// })
		// debug(`getMessagesByChatRoomId/data: ${JSON.stringify(data)}`);

		const params = {chatRoomId}
		const data = await this.get("/v1/messages-by-chat-room-id", {params})
		debug(`ChatAPI | getMessagesByChatRoomId | data: ${JSON.stringify(data)}`);

		return data;
	}

	async saveMessage(chatRoomId, senderId, body, fileContent) {
		debug("saveMessage")
        debug(`chatRoomId: ${chatRoomId}`)
        debug(`senderId: ${senderId}`)
        debug(`body: ${body}`)
        debug(`fileContent: ${fileContent}`)

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

        // const data = await this.post("/chat-service/getChatRoomByParticipantIds", {
        //     body: {
        //         participantIds
        //     }
        // })
        // debug(`getChatRoomByParticipantIds/data: ${JSON.stringify(data)}`);
		const params = {participantIds}
        const data = await this.get("/v1/chat-room-by-participant-ids", {params})
        debug(`ChatAPI | getChatRoomByParticipantIds | data: ${JSON.stringify(data)}`);

        return data;
	}

	async createChatRoomWithParticipantIds(participantIds) {
		debug("createChatRoomWithParticipantIds")
        debug(`participantIds: ${participantIds}`);

        const data = await this.post("/v1/createChatRoomWithParticipantIds", {
            body: {
                participantIds
            }
        })
        debug(`createChatRoomWithParticipantIds/data: ${JSON.stringify(data)}`);
        return data;
	}
}

module.exports = {ChatAPI};