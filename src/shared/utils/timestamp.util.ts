import { timestamp } from 'drizzle-orm/pg-core';

function withTZ(name: string) {
  return timestamp(name, { withTimezone: true }).defaultNow().notNull();
}

function createdAt() {
  return withTZ('created_at');
}

function updatedAt() {
  return withTZ('updated_at');
}

function timestamps() {
  return {
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  };
}

export const timestampUtil = {
  createdAt,
  updatedAt,
  timestamps,
};
