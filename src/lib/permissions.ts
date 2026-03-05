export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export const PERMISSIONS = {
    MANAGE_WORKSPACE: ['ADMIN'],
    MANAGE_MEMBERS: ['ADMIN'],
    MANAGE_CATEGORIES: ['ADMIN'],
    MANAGE_ACCOUNTS: ['ADMIN'],
    MANAGE_BUDGETS: ['ADMIN'],
    WRITE_TRANSACTIONS: ['ADMIN', 'EDITOR'],
    READ_REPORTS: ['ADMIN', 'EDITOR', 'VIEWER'],
    READ_ALERTS: ['ADMIN', 'EDITOR', 'VIEWER'],
} as const;

export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS): boolean {
    return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
