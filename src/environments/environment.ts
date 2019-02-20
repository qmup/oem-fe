// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses 'environment.ts', but if you do
// 'ng build --env=prod' then 'environment.prod.ts' will be used instead.
// The list of which env maps to which file can be found in '.angular-cli.json'.

export const environment = {
  production: false,
  endPoint: 'http://localhost:8080/',
  apiPaths: {
    admin: {
      beacon: {
        create: 'admin/beacon/create',
        getAll: 'admin/beacon/get-all',
        remove: 'admin/beacon/remove/',
        update: 'admin/beacon/update-dto/',
        getByWorkplace: 'admin/beacon/get-beacon-by-workplace?workplaceId=',
      },
      employee: {
        create: 'admin/employee/create',
        get: 'admin/employee/get-by-manager',
        getAll: 'admin/employee/get-all',
        remove: 'admin/employee/remove/',
        update: 'admin/employee/update-dto/',
        getById: 'admin/employee/get-info?id='
      },
      manager: {
        create: 'admin/employee/create',
        getAll: 'admin/employee/get-list-manager',
        remove: 'admin/employee/remove/',
        update: 'admin/employee/update-dto/',
      },
      workplace: {
        create: 'admin/workplace/create',
        getAll: 'admin/workplace/get-all',
        remove: 'admin/workplace/remove/',
        update: 'admin/workplace/update-dto/',
      },
    },
    manager: {
      task: {
        create: 'manager/create',
        getTaskByStatus: 'manager/get-task-by-status',
        getTaskDetail: 'manager/get-task-detail',
        getTaskByDate: 'manager/get-task-from-date-to-date',
        getTodayTask: 'manager/get-today-task',
        summaryTask: 'manager/summary-task-all-employee-by-manager',
      },
      schedule: {
        create: 'schedule/create',
        getAll: 'schedule/get-all',
      }
    }
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * 'zone.run', 'zoneDelegate.invokeTask' for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
