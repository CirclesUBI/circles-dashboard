let events = [];

export function findEvent(id) {
  return events.find((item) => {
    return item.id === id;
  });
}

export function setEvents(newEvents) {
  events = newEvents;
}

export function getEvents() {
  return events;
}
