import { IMessageHandler } from './IMessageHandler';
import { MessageSubscriptionNode } from './MessageSubscriptionNode';
import { Message, MessagePriority } from './Message';

/**
 * Used for Sending messages
 */
export class MessageBus {
    private static _subscriptions: { [code: string]: IMessageHandler[] } = {};

    public static _normalQueueMessagePerUpdate: number = 10;

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
            console.warn('Attempting to add a duplicate handler to code: ' + code + '. Subscription not added.');
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
            console.warn('Cannot unsubscribe handler from code: ' + code + ' Because that code is not subscribed to.');
            return;
        }

        const nodeIndex = MessageBus._subscriptions[code].indexOf(handler);
        if (nodeIndex !== -1) {
            MessageBus._subscriptions[code].splice(nodeIndex, 1);
        }
    }

    /**
     * POst Method
     * @param {Message} message
     */
    public static post(message: Message): void {
        console.log('Message posted:', message);
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

        const messageLimit = Math.min(MessageBus._normalQueueMessagePerUpdate, MessageBus._normalMessageQueue.length);
        for (let i = 0; i < messageLimit; ++i) {
            const node = MessageBus._normalMessageQueue.pop();
            node.handler.onMessage(node.message);
        }
    }
}
