import { Migration } from '../Migration';

export const aggregateEvents = ({ events }: Migration) => {
  // task-success
  events.on('transform-success', (options) => {
    events.emit('task-success', options);
  });
  events.on('create-success', (options) => {
    events.emit('task-success', options);
  });
  events.on('rename-success', (options) => {
    events.emit('task-success', options);
  });
  events.on('remove-success', (options) => {
    events.emit('task-success', options);
  });

  // task-fail
  events.on('transform-fail', (options) => {
    events.emit('task-fail', options);
  });
  events.on('create-fail', (options) => {
    events.emit('task-fail', options);
  });
  events.on('rename-fail', (options) => {
    events.emit('task-fail', options);
  });
};
