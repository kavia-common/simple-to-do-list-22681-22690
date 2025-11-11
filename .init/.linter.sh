#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-to-do-list-22681-22690/todo_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

