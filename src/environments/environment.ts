// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses 'environment.ts', but if you do
// 'ng build --env=prod' then 'environment.prod.ts' will be used instead.
// The list of which env maps to which file can be found in '.angular-cli.json'.

export const environment = {
  production: false,
  endPoint: 'http://localhost:8080/',
  apiPaths: {
    beacon: {
      create: 'beacon/create',
      getAll: 'beacon/get-all',
      remove: 'beacon/remove/',
      update: 'beacon/update-dto/',
      getByWorkplace: 'beacon/get-beacon-by-workplace?workplaceId=',
    },
    employee: {
      create: 'employee/create',
      get: 'employee/get-by-manager',
      getAll: 'employee/get-all',
      remove: 'employee/remove/',
      update: 'employee/update-dto/',
      getById: 'employee/get-info?id='
    },
    manager: {
      create: 'employee/create',
      getAll: 'employee/get-list-manager',
      remove: 'employee/remove/',
      update: 'employee/update-dto/',
    },
    workplace: {
      create: 'workplace/create',
      getAll: 'workplace/get-all',
      remove: 'workplace/remove/',
      update: 'workplace/update-dto/',
    },
    task: {
      create: 'task/create',
      getTaskByStatus: 'task/get-task-by-status',
      getTaskDetail: 'task/get-task-detail',
      getTaskByDate: 'task/get-task-from-date-to-date',
      getTodayTask: 'task/get-today-task',
      summaryTask: 'task/summary-task-all-employee-by-manager',
    },
    schedule: {
      create: 'schedule/create',
      getAll: 'schedule/get-all',
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
