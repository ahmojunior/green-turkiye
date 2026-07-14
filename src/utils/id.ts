// Short random id for ephemeral, client-only entities (crisis nodes, floating text).
export const generateId = (): string => Math.random().toString(36).slice(2, 11);
