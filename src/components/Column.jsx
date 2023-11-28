import React, { useState } from 'react';
import AddTaskButton from './AddTaskButton';
import Task from './Task';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import uuid from 'react-uuid';

const Column = ({ tag, currentEvent, events, setEvents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleAdd = () => {
    const name = prompt('Enter task name:');
    const details = prompt('Enter details:');
    if (!(name && details)) return;
    setEvents((prev) => {
      const arrCopy = [...prev];
      const index = prev.findIndex((event) => event.title === currentEvent.title);
      const eventCopy = arrCopy[index];
      // Remove old and add the latest data
      arrCopy.splice(index, 1, {
        ...eventCopy,
        [tag]: [
          ...eventCopy[tag],
          { name: name, id: uuid(), details: details },
        ],
      });
      const addedItemId = arrCopy[index][tag].find(
        (item) => item.name === name && item.details === details
      ).id;
      // Show alert here
      alert(`Item with id ${addedItemId} added to ${tag} in ${currentEvent.title}`);
      return arrCopy;
    });
  };

  const handleRemove = (id, e) => {
    e.stopPropagation();
    setEvents((prev) =>
      prev.map((event) => {
        if (event.title === currentEvent.title) {
          const taskList = event[tag];
          const index = taskList.findIndex((item) => item.id === id);
          taskList.splice(index, 1);
          const updatedEvent = { ...event, [tag]: [...taskList] };
          // Show alert here
          alert(`Item removed from ${tag} in ${event.title}`);
          return updatedEvent;
        } else {
          return event;
        }
      })
    );
  };
  

  const handleUpdate = (id) => {
    const name = prompt('Update task name:');
    const details = prompt('Update details:');
    if (!(name && details)) return;
    setEvents((prev) =>
      prev.map((event) => {
        if (event.title === currentEvent.title) {
          const taskList = event[tag];
          const index = taskList.findIndex((item) => item.id === id);
          const updatedTask = {
            ...taskList[index],
            name,
            details,
          };
          taskList.splice(index, 1);
          const updatedEvent = { ...event, [tag]: [...taskList, updatedTask] };
          // Show alert here
          alert(`Item updated in ${tag} of ${event.title}`);
          return updatedEvent;
        } else {
          return event;
        }
      })
    );
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='column'>
      <div>
        {tag}
        <AddTaskButton handleClick={handleAdd} />
      </div>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Droppable droppableId={tag}>
        {(provided, snapshot) => {
          const filteredTasks = events
            .find((event) => event.title === currentEvent.title)
            ?.[tag]
            .filter(
              (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.details.toLowerCase().includes(searchTerm.toLowerCase())
            );

          return (
            <div className='task-container' ref={provided.innerRef} {...provided.droppableProps}>
              {filteredTasks.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Task
                      name={item.name}
                      details={item.details}
                      id={item.id}
                      provided={provided}
                      snapshot={snapshot}
                      handleRemove={handleRemove}
                      handleUpdate={handleUpdate}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

export default Column;