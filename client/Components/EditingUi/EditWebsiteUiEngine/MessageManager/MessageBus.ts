import { IMessageHandler } from './IMessageHandler.js';
import { MessageSubscriptionNode } from './MessageSubscriptionNode.js';
import { Message, MessagePriority } from './Message.js';

/**
 * Used for Sending messages
 */
export class MessageBus {
    private static _subscriptions: { [code: string]: IMessageHandler[] } = {};

    public static _normalQueueMessagePerUpdate: number = 20;

    private static _normalMessageQueue: MessageSubscriptionNode[] = [];

    /**
     * Class constructor
     */
    private constructor() {

    }

    /**
     * Add subscription func
     * @param {string} code
     * @param {IMessageHandler} handler
     */
    public static addSubscrition(code: string, handler: IMessageHandler): void {
        if (MessageBus._subscriptions[code] === undefined) {
            MessageBus._subscriptions[code] = [];
        }
        if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
            console.warn('Attemting to add duplicate handler to code:' + code);
        } else {
            MessageBus._subscriptions[code].push(handler);
        }
    }

    /**
     * REmove Subscription
     * @param {string} code
     * @param {IMessageHandler} handler
     */
    public static removeSubscrition(code: string, handler: IMessageHandler): void {
        if (MessageBus._subscriptions[code] === undefined) {
            console.warn('cannot unsubscribe handler from code:' + code);
            return;
        }

        const nodeIndex = MessageBus._subscriptions[code].indexOf(handler);
        if (MessageBus._subscriptions[code].indexOf(handler) !== -1) {
            MessageBus._subscriptions[code].splice(nodeIndex, 1);
        }
    }

    /**
     * POst Method
     * @param {Message} message
     */
    public static post(message: Message): void {
        console.log(`Message posted ${message}`);
        const handlers = MessageBus._subscriptions[message.code];

        if (handlers === undefined) {
            return;
        }

        for (const h of handlers) {
            if (message.priority === MessagePriority.HIGH) {
                h.onMessage(message);
            } else {
                MessageBus._normalMessageQueue.push(new MessageSubscriptionNode(message, h));
            }
        }
    }

    /**
     * Update Method
     * @param {number} time
     */
    public static update(time: number): void {
        if (MessageBus._normalMessageQueue.length === 0) {
            return;
        }
        const MessageLimit = Math.min(MessageBus._normalQueueMessagePerUpdate, MessageBus._normalMessageQueue.length);

        for (let i = 0; i < MessageLimit; i++) {
            const node = MessageBus._normalMessageQueue.pop();
            node.handler.onMessage(node.message);
        }
    }
}
