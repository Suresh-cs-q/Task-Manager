const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

/**
 * Adds a new task to the list at the specified position.
 * @param {string} position - 'top' or 'bottom'
 */
function addTask(position) {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  // Create a new list item for the task
  const li = document.createElement('li');
  li.dataset.completed = 'false';

  // Create the task content element
  const taskContent = document.createElement('span');
  taskContent.textContent = taskText;

  // Create the control buttons container
  const controls = document.createElement('div');
  controls.innerHTML = `
    <button class="up">↑</button>
    <button class="down">↓</button>
    <button class="complete">✓</button>
    <button class="delete">×</button>
  `;

  li.appendChild(taskContent);
  li.appendChild(controls);

  // Insert the task at the specified position
  if (position === 'top' && taskList.firstChild) {
    taskList.insertBefore(li, taskList.firstChild);
  } else {
    taskList.appendChild(li);
  }

  taskInput.value = '';
  addEventListeners(li);
  updateButtonStates(li);
}

/**
 * Attaches event listeners to the task's control buttons.
 * @param {HTMLElement} li - The list item element.
 */
function addEventListeners(li) {
  li.querySelector('.up').addEventListener('click', () => moveTask(li, 'up'));
  li.querySelector('.down').addEventListener('click', () => moveTask(li, 'down'));
  li.querySelector('.complete').addEventListener('click', () => toggleComplete(li));
  li.querySelector('.delete').addEventListener('click', () => li.remove());
}

/**
 * Moves a task up or down in the list.
 * @param {HTMLElement} li - The list item element.
 * @param {string} direction - 'up' or 'down'
 */
function moveTask(li, direction) {
  if (li.dataset.completed === 'true') return;

  const sibling = direction === 'up' 
    ? li.previousElementSibling 
    : li.nextElementSibling;

  if (sibling && sibling.dataset.completed !== 'true') {
    li.parentNode.insertBefore(
      direction === 'up' ? li : sibling,
      direction === 'up' ? sibling : li.nextElementSibling
    );
  }
  
  updateButtonStates(li);
}

/**
 * Toggles the completed status of a task.
 * @param {HTMLElement} li - The list item element.
 */
function toggleComplete(li) {
  li.classList.toggle('completed');
  const isCompleted = li.dataset.completed === 'true';
  li.dataset.completed = !isCompleted;
  
  if (!isCompleted) {
    // Disable move buttons when completed and move the task to the bottom
    li.querySelectorAll('.up, .down').forEach(btn => btn.disabled = true);
    taskList.appendChild(li);
  } else {
    li.querySelectorAll('.up, .down').forEach(btn => btn.disabled = false);
    updateButtonStates(li);
  }
}

/**
 * Updates the state of the move buttons based on the task's position.
 * @param {HTMLElement} li - The list item element.
 */
function updateButtonStates(li) {
  if (li.dataset.completed === 'true') return;

  const upBtn = li.querySelector('.up');
  const downBtn = li.querySelector('.down');
  
  upBtn.disabled = !li.previousElementSibling;
  downBtn.disabled = !li.nextElementSibling;
}
