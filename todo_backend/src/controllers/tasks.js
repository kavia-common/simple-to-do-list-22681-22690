'use strict';

const taskService = require('../services/tasks');

class TasksController {
  // PUBLIC_INTERFACE
  /**
   * Create a new task
   * Request body: { title: string (required), description?: string, completed?: boolean }
   * Returns: 201 with created task
   */
  create(req, res) {
    const { valid, errors } = taskService.validate(req.body, false);
    if (!valid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    const created = taskService.create(req.body);
    return res.status(201).json(created);
  }

  // PUBLIC_INTERFACE
  /**
   * List tasks
   * Returns: 200 with array of tasks
   */
  list(req, res) {
    const items = taskService.list();
    return res.status(200).json(items);
  }

  // PUBLIC_INTERFACE
  /**
   * Get single task by id
   * Path params: id
   * Returns: 200 with task or 404
   */
  get(req, res) {
    const { id } = req.params;
    const found = taskService.get(id);
    if (!found) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(found);
  }

  // PUBLIC_INTERFACE
  /**
   * Update a task by id (PUT - full replace semantics with validation)
   * Request body: { title: string, description?: string, completed?: boolean }
   * Returns: 200 with updated task or 404
   */
  update(req, res) {
    const { id } = req.params;
    const { valid, errors } = taskService.validate(req.body, false);
    if (!valid) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    const updated = taskService.replace(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json(updated);
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a task by id
   * Returns: 204 on success or 404
   */
  remove(req, res) {
    const { id } = req.params;
    const ok = taskService.delete(id);
    if (!ok) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(204).send();
  }
}

module.exports = new TasksController();
