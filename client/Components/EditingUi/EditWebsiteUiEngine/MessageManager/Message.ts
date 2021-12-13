import { MessageBus } from './MessageBus';
import { IMessageHandler } from './IMessageHandler';

/** Represents message priorities. */
export enum MessagePriority {

    /** Normal message priority, meaning the message is sent as soon as the queue allows. */
    NORMAL,

    /** High message priority, meaning the message is sent immediately. */
    HIGH
}
/**
 * Message Class
 */
export class Message {
    /** The code for this message, which is subscribed to and listened for. */
    public code: string;

    /** Free-form context data to be included with this message. */
    public context: any;

    /** The class instance which sent this message. */
    public sender: any;

    /** The priority of this message. */
    public priority: MessagePriority;

    /**
     * Class Constructor
     * @param {string} code
     * @param {any} sender
     * @param {any} context
     * @param {MessagePriority} priority
     */
    public constructor(code: string, sender: any, context?: any, priority: MessagePriority = MessagePriority.NORMAL) {
        this.code = code;
        this.sender = sender;
        this.context = context;
        this.priority = priority;
    }

    /**
    * Sends a normal-priority message with the provided parameters.
    * @param {string} code The code for this message, which is subscribed to and listened for.
    * @param {any} sender The class instance which sent this message.
    * @param {any} context Free-form context data to be included with this message.
    */
    public static send(code: string, sender: any, context?: any): void {
        MessageBus.post(new Message(code, sender, context, MessagePriority.NORMAL));
    }

    /**
    * Sends a normal-priority message with the provided parameters.
    * @param {string} code The code for this message, which is subscribed to and listened for.
    * @param {any} sender The class instance which sent this message.
    * @param {any} context Free-form context data to be included with this message.
    */
    public static sendPriority(code: string, sender: any, context?: any): void {
        MessageBus.post(new Message(code, sender, context, MessagePriority.HIGH));
    }

    /**
     * Subscribes the provided handler to listen for the message code provided.
     * @param {string} code The code to listen for.
     * @param {IMessageHandler} handler The message handler to be called when a message containing the provided code is sent.
     */
    public static subscribe(code: string, handler: IMessageHandler): void {
        MessageBus.addSubscrition(code, handler);
    }

    /**
     * Unsubscribes the provided handler from listening for the message code provided.
     * @param {string} code The code to no longer listen for.
     * @param {IMessageHandler} handler The message handler to unsubscribe.
     */
    public static unsubscribe(code: string, handler: IMessageHandler): void {
        MessageBus.removeSubscrition(code, handler);
    }
}
