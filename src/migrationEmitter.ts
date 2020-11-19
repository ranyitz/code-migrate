import { EventEmitter } from 'events';
import type { Task, File } from './types';

type EventPayload = { task: Task };

type TransformEvent =
  | 'transform-start'
  | 'transform-success-change'
  | 'transform-fail'
  | 'transform-success-noop';

export type TransformEventPayload = EventPayload & {
  file: File;
  error?: Error;
  originalFile?: any;
  newFile?: any;
};

type TaskEvent = 'task-start';

export type TaskEventPayload = EventPayload & { task: Task };

export type MigrationEmitterEvent = TransformEvent | TaskEvent;

export class MigrationEmitter extends EventEmitter {
  emitTransformEvent(
    eventName: TransformEvent,
    payload: TransformEventPayload
  ): void {
    this.emit(eventName, payload);
  }

  onTransformEvent(
    eventName: TransformEvent,
    fn: (payload: TransformEventPayload) => void
  ): void {
    this.on(eventName, fn);
  }

  emitTaskEvent(eventName: TaskEvent, payload: TaskEventPayload): void {
    this.emit(eventName, payload);
  }

  onTaskEvent(
    eventName: TaskEvent,
    fn: (payload: TaskEventPayload) => void
  ): void {
    this.on(eventName, fn);
  }
}
