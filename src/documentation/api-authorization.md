
# API Authorization Documentation

This document outlines the role-based access control (RBAC) for all API endpoints in the TaskFlow application. Each API endpoint is accessible only to users with the appropriate role(s).

## Role Hierarchy

The application has the following role hierarchy (from highest permissions to lowest):

1. **SuperAdmin** - Complete system access
2. **Admin** - Administrative access with some limitations
3. **GroupLeader** - Team management capabilities
4. **DepartmentManager** - Department-specific management 
5. **Manager** - Limited management capabilities
6. **TeamLead** - Team leadership capabilities
7. **Employee** - Basic user access
8. **Contractor** - Limited external access
9. **Guest** - Minimal view-only access

## API Access by Module

### Customer APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/customers` | GET | Fetch all customers | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead |
| `/api/customers/:id` | GET | Fetch a specific customer | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead, Employee |
| `/api/customers` | POST | Create a new customer | SuperAdmin, Admin, GroupLeader, Manager |
| `/api/customers/:id` | PATCH | Update a customer | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager |
| `/api/customers/:id` | DELETE | Delete a customer | SuperAdmin, Admin |

### User APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/users` | GET | Fetch all users | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager |
| `/api/users/:id` | GET | Fetch a specific user | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager |
| `/api/users` | POST | Create a new user | SuperAdmin, Admin |
| `/api/users/:id` | PATCH | Update a user | SuperAdmin, Admin, GroupLeader (for their team only) |
| `/api/users/:id` | DELETE | Delete a user | SuperAdmin, Admin |
| `/api/users/:id/permissions` | GET | Get user permissions | SuperAdmin, Admin |

### Task APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/tasks` | GET | Fetch all tasks | All roles |
| `/api/tasks/:id` | GET | Fetch a specific task | All roles |
| `/api/tasks` | POST | Create a new task | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead, Employee |
| `/api/tasks/:id` | PATCH | Update a task | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead, Employee (if assigned) |
| `/api/tasks/:id` | DELETE | Delete a task | SuperAdmin, Admin, GroupLeader, Creator of task |
| `/api/tasks/:id/status` | PATCH | Update task status | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead, Employee (if assigned) |
| `/api/tasks/:id/comments` | POST | Add comment to task | All roles except Guest |

### Vendor APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/vendors` | GET | Fetch all vendors | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager |
| `/api/vendors/:id` | GET | Fetch a specific vendor | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead |
| `/api/vendors` | POST | Create a new vendor | SuperAdmin, Admin, GroupLeader |
| `/api/vendors/:id` | PATCH | Update a vendor | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager |
| `/api/vendors/:id` | DELETE | Delete a vendor | SuperAdmin, Admin |

### Asset APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/assets` | GET | Fetch all assets | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager |
| `/api/assets/:id` | GET | Fetch a specific asset | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead, Employee (if assigned) |
| `/api/assets` | POST | Create a new asset | SuperAdmin, Admin, DepartmentManager |
| `/api/assets/:id` | PATCH | Update an asset | SuperAdmin, Admin, DepartmentManager, Manager |
| `/api/assets/:id` | DELETE | Delete an asset | SuperAdmin, Admin |
| `/api/assets/:id/maintenance-records` | GET | Get asset maintenance records | SuperAdmin, Admin, DepartmentManager, Manager, TeamLead |
| `/api/assets/:id/maintenance-records` | POST | Add maintenance record | SuperAdmin, Admin, DepartmentManager, Manager |

### Inventory APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/inventory` | GET | Fetch all inventory items | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager |
| `/api/inventory/:id` | GET | Fetch a specific inventory item | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead |
| `/api/inventory` | POST | Create a new inventory item | SuperAdmin, Admin, DepartmentManager, Manager |
| `/api/inventory/:id` | PATCH | Update an inventory item | SuperAdmin, Admin, DepartmentManager, Manager |
| `/api/inventory/:id` | DELETE | Delete an inventory item | SuperAdmin, Admin |
| `/api/inventory/:id/quantity` | PATCH | Update item quantity | SuperAdmin, Admin, DepartmentManager, Manager, TeamLead |

### Software License APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/licenses` | GET | Fetch all software licenses | SuperAdmin, Admin, DepartmentManager, Manager |
| `/api/licenses/:id` | GET | Fetch a specific software license | SuperAdmin, Admin, DepartmentManager, Manager, TeamLead |
| `/api/licenses` | POST | Create a new software license | SuperAdmin, Admin |
| `/api/licenses/:id` | PATCH | Update a software license | SuperAdmin, Admin, DepartmentManager |
| `/api/licenses/:id` | DELETE | Delete a software license | SuperAdmin, Admin |
| `/api/licenses/:id/assign` | POST | Assign license to user | SuperAdmin, Admin, DepartmentManager, Manager |
| `/api/licenses/:id/unassign/:userId` | DELETE | Unassign license from user | SuperAdmin, Admin, DepartmentManager, Manager |

### Report APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/reports/dashboard` | GET | Get dashboard metrics | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead |
| `/api/reports/tasks` | GET | Get task reports | SuperAdmin, Admin, GroupLeader, DepartmentManager, Manager, TeamLead |
| `/api/reports/assets` | GET | Get asset reports | SuperAdmin, Admin, DepartmentManager, Manager |
| `/api/reports/inventory` | GET | Get inventory reports | SuperAdmin, Admin, DepartmentManager, Manager |
| `/api/reports/custom` | POST | Generate custom report | SuperAdmin, Admin |

### Settings APIs

| API Endpoint | Method | Description | Authorized Roles |
|--------------|--------|-------------|------------------|
| `/api/settings` | GET | Fetch system settings | SuperAdmin, Admin |
| `/api/settings` | PATCH | Update system settings | SuperAdmin, Admin |
| `/api/settings/permissions` | GET | Fetch permission settings | SuperAdmin, Admin |
| `/api/settings/permissions` | POST | Update permission settings | SuperAdmin |
| `/api/settings/roles` | GET | Fetch role definitions | SuperAdmin, Admin |
| `/api/settings/modules` | PATCH | Enable/disable modules | SuperAdmin |

## Implementing API Authorization

### Backend Authorization Middleware

The API authorization is implemented using middleware that checks the user's role against the required roles for each endpoint:

```typescript
// Example backend middleware
const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    
    // SuperAdmin always has access
    if (userRole === UserRole.SuperAdmin) {
      return next();
    }
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: true,
        message: "You don't have permission to access this resource",
        status: 403,
        code: "FORBIDDEN"
      });
    }
    
    next();
  };
};

// Example route with authorization
router.post(
  "/customers", 
  authorizeRoles([UserRole.SuperAdmin, UserRole.Admin, UserRole.GroupLeader, UserRole.Manager]), 
  createCustomerHandler
);
```

### Frontend Integration

On the frontend, components should check for appropriate permissions before showing UI elements:

```typescript
// Example React component with permission check
const CustomerActions = () => {
  const { hasPermission } = useRolePermissions();
  
  return (
    <div>
      {hasPermission("create-customers") && (
        <Button onClick={openCreateCustomerModal}>
          Add Customer
        </Button>
      )}
    </div>
  );
};
```

## Special Access Rules

1. **Data Scoping**
   - DepartmentManagers can only access data within their department
   - GroupLeaders can only access data for their team members
   - TeamLeads can only access data for their team members

2. **Own Data Access**
   - All users can view and edit their own user profile
   - All users can view tasks assigned to them
   - All users can view assets assigned to them

3. **SuperAdmin Privileges**
   - SuperAdmin users bypass all permission checks
   - SuperAdmin actions are logged for audit purposes

## Audit Trail

All API access is logged with:
- User ID
- Timestamp
- Action taken
- Resource accessed

SuperAdmin and Admin users can view the audit logs through the admin dashboard.

## Implementation Notes

1. The permission system integrates with the JWT authentication system
2. Permissions are checked both on the frontend (UI) and backend (API) levels
3. Higher-level roles inherit permissions from lower-level roles
4. Special business rules may override the standard role-based permissions

## Testing Authorization

To test API authorization, use the following test accounts:

- SuperAdmin: superadmin@example.com / password
- Admin: admin@example.com / password
- Manager: manager@example.com / password
- Employee: employee@example.com / password

Each test account has the appropriate roles and permissions for testing different access scenarios.
