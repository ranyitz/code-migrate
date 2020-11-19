import { EventEmitter } from 'events';
import type { Task, File } from './types';

type EventPayload = { task: Task };
export type TransformEventPaylod = EventPayload & { file: File; error?: Error };

export class MigrationEmitter extends EventEmitter {
  emitTransformEvent(
    eventName: TransformEvent,
    payload: TransformEventPaylod
  ): void {
    this.emit(eventName, payload);
  }

  onTransformEvent(
    eventName: TransformEvent,
    fn: (payload: TransformEventPaylod) => void
  ): void {
    this.on(eventName, fn);
  }
}

type TransformEvent =
  | 'transform-start'
  | 'transform-success-change'
  | 'transform-fail'
  | 'transform-success-noop';

export type MigrationEmitterEvent = TransformEvent;
