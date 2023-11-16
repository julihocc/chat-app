// contactService/models/ChatRoomModel.js
const { Schema, model } = require("mongoose");
const logger = require("../utils/logger"); // Import the logger

function arrayLimit(val) {
  //logger.debug(`arrayLimit: val: ${val}`); // Replace console.log with //logger.debug
  return val.length >= 2;
}

const chatRoomSchema = new Schema(
  {
    participantIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: [arrayLimit, "{PATH} must have at least two participantIds."],
    },
    messageIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true },
);

module.exports = model("ChatRoom", chatRoomSchema);