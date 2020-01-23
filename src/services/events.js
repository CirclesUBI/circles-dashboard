const events = [];

export function findEvent(id) {
  return events.find(item => {
    return item.id === id;
  });
}

export function addEvents(newEvents) {
  newEvents.forEach(item => {
    if (!findEvent(item.id)) {
      events.push(item);
    }
  });
}

export function getEvents(timestamp = 0) {
  return events.filter(item => {
    return item.timestamp >= timestamp;
  });
}
