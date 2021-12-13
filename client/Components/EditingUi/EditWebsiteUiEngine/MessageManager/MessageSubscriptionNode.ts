import { IMessageHandler } from './IMessageHandler.js';
import { Message } from './Message.js';

/**
 * MessageSubscriptionNode class
 */
export class MessageSubscriptionNode {
    public message: Message;
    public handler: IMessageHandler;

    /**
     * Cass constructor
     * @param {Message} message
     * @param {IMessageHandler} handler
     */
    constructor(message: Message, handler: IMessageHandler) {
        this.message = message;
        this.handler = handler;
    }
}
