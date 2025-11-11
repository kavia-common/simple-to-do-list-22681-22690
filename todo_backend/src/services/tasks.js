'use strict';

const { randomUUID } = require('crypto');

/**
 * In-memory task store.
 * TODO: Replace with real database integration (e.g., Postgres, MongoDB) via an ORM or query layer.
 * Note: This data will reset on server restart.
 */
class TaskService {
  constructor() {
    this.tasks = new Map();
  }

  /**
   * Validate the task payload for creation/update
   * @param {object} data
   * @param {boolean} isPartial allow partial for update
   * @returns {{valid: boolean, errors: string[]}}
   */
  validate(data, isPartial = false) {
    const errors = [];
    if (!isPartial || Object.prototype.hasOwnProperty.call(data, 'title')) {
      if (typeof data.title !== 'string' || data.title.trim().length === 0) {
        errors.push('title is required and must be a non-empty string');
      }
    }
    if (Object.prototype.hasOwnProperty.call(data, 'description')) {
      if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
        errors.push('description must be a string if provided');
      }
    }
    if (Object.prototype.hasOwnProperty.call(data, 'completed')) {
      if (typeof data.completed !== 'boolean') {
        errors.push('completed must be a boolean if provided');
      }
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Create a task
   * @param {{title: string, description?: string, completed?: boolean}} payload
   */
  create(payload) {
    const now = new Date().toISOString();
    const id = randomUUID();
    const task = {
      id,
      title: payload.title.trim(),
      description: payload.description ?? '',
      completed: payload.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, task);
    return task;
  }

  /**
   * List all tasks
   */
  list() {
    return Array.from(this.tasks.values());
  }

  /**
   * Get task by id
   */
  get(id) {
    return this.tasks.get(id) || null;
  }

  /**
   * Replace task (PUT)
   */
  replace(id, payload) {
    const existing = this.get(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const replaced = {
      id,
      title: payload.title.trim(),
      description: payload.description ?? '',
      completed: payload.completed ?? false,
      createdAt: existing.createdAt,
      updatedAt: now,
    };
    this.tasks.set(id, replaced);
    return replaced;
  }

  /**
   * Update task (PATCH-like for our PUT validation flow already covers full update)
   */
  update(id, payload) {
    const existing = this.get(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...payload,
      title: payload.title !== undefined ? String(payload.title).trim() : existing.title,
      description: payload.description !== undefined ? payload.description : existing.description,
      completed: payload.completed !== undefined ? payload.completed : existing.completed,
      updatedAt: now,
    };
    this.tasks.set(id, updated);
    return updated;
  }

  /**
   * Delete task by id
   */
  delete(id) {
    return this.tasks.delete(id);
  }
}

module.exports = new TaskService();
