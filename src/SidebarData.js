export const sidebarData = [
    {
        id: 1,
        name: 'Setup',
        path: '/setup',
        subCategory: [
            {
                id: 1,
                subname: 'UOM Management',
                path: '/setup/uom-management',
            },
            {
                id: 2,
                subname: 'Lot Management',
                path: '/setup/lot-management',
            },
            {
                id: 3,
                subname: 'Raw Materials',
                path: '/maincontent/setup/raw-materials',
                
            }
        ]
    },
    {
        id: 2,
        name: 'User Management',
        path: '/user',
        subCategory: [
            {
                id: 10,
                subname: 'User Account',
                path: '/user/user-account',
            },
            {
                id: 11,
                subname: 'User Role',
                path: '/maincontent/user/user-role',
            }
        ]
    },
    {
        id: 3,
        name: 'Import',
        path: '/maincontent/import',
        subCategory: [
            {
                id: 10,
                subname: 'Import PO',
                path: '/maincontent/import/import-po',
            },
            {
                id: 11,
                subname: 'Import Order',
                path: '/maincontent/import/import-order',
            },
            {
                id: 11,
                subname: 'Import Raw Materials',
                path: '/maincontent/import/import-rawmaterials',
            }
        ]
    }

]