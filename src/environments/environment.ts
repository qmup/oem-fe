// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses 'environment.ts', but if you do
// 'ng build --env=prod' then 'environment.prod.ts' will be used instead.
// The list of which env maps to which file can be found in '.angular-cli.json'.

export const environment = {
  production: false,
  token: 'OEM_TOKEN',
  account: 'OEM_ACCOUNT',
  // endPoint: 'http://localhost:8080/',
  endPoint: 'http://113.161.84.125/',
  apiPaths: {
    firebase: {
      apiKey: 'AIzaSyCv23Kx9Xfh4okq30jtY_QJi2CudhO_7f4',
      authDomain: 'outdoor-management-servi-8ca4e.firebaseapp.com',
      databaseURL: 'https://outdoor-management-servi-8ca4e.firebaseio.com',
      projectId: 'outdoor-management-servi-8ca4e',
      storageBucket: 'outdoor-management-servi-8ca4e.appspot.com',
      messagingSenderId: '244083668959'
    },
    authorize: {
      login: 'account/login',
      getInformation: 'account/get-info',
    },
    assign: {
      assignTask: 'assign-task/',
    },
    beacon: {
      create: 'beacon/create',
      getAll: 'beacon/get-all',
      remove: 'beacon/remove/',
      update: 'beacon/update-dto/',
      getByWorkplace: 'beacon/get-beacon-by-workplace',
    },
    employee: {
      create: 'employee/create',
      get: 'employee/get-by-manager',
      getAll: 'employee/get-all',
      remove: 'employee/remove/',
      update: 'employee/update-dto/',
      updateField: 'employee/update/',
      getById: 'employee/get-info',
      getEmployeeByManager: 'employee/get-list/by-manager',
      getByRole: 'employee/get-list/by-role',
      getAllRole: `employee/get-all-role`,
      checkExist: 'account/check-exist-username'
    },
    manager: {
      create: 'employee/create',
      getAll: 'employee/get-list/manager',
      remove: 'employee/remove/',
      update: 'employee/update-dto/',
    },
    workplace: {
      create: 'workplace/create',
      getAll: 'workplace/get-all',
      remove: 'workplace/remove/',
      update: 'workplace/update-dto/',
      addTask: 'workplace/add-task/',
      addManager: 'workplace/add-manager',
      getTaskBasic: 'workplace/get-task-basic/',
      getByManager: 'workplace/get-list-by-manager',
      removeFromManager: 'workplace/remove-workplace-from-manager',
      addTaskToWorkplace: 'workplace/add-task-to-workplace',
    },
    task: {
      checkAttendance: 'task/check-attendance',
      create: 'task/create',
      getTaskByEmployee: 'task/get-task-by-employee',
      getTaskByManager: 'task/get-task-by-manager',
      getTaskByStatus: 'task/get-task-by-status',
      getTaskDetail: 'task/get-task-detail',
      getTaskByDate: 'task/get-task-from-date-to-date',
      getTodayTask: 'task/get-today-task',
      getTodayTaskByManager: 'task/get-today-task-by-manager',
      getUpcomingTask: 'task/get-upcoming-task',
      remove: 'task/remove-task',
      summaryTaskAllEmployeeByManager: 'task/summary-task-all-employee-by-manager',
      summaryTaskByEmployee: 'task/summary-task-by-employee',
      update: 'task/update-task',
    },
    report: {
      delete: 'report/delete-report/',
      getByTaskId: 'report/get-report/',
      submit: 'report/submit-report',
      update: 'report/update',
    },
    taskBasic: {
      get: 'task/get-task-basic',
      getListBasic: 'task-basic/get-list-basic/',
      setToManager: 'task-basic/set-to-manager',
    },
    schedule: {
      create: 'schedule/create',
      getAll: 'schedule/get-all',
    },
    upload: {
      handlerUpload: 'upload/handler-upload',
    },
    company: {
      create: 'company/add-company',
      getAll: 'company/get-all',
      getById: 'company/get-company-by-id',
      remove: 'company/remove-company',
      update: 'company/update-company-information',
    },
    zone: {
      create: 'zone/add-zone',
      getByCompany: 'zone/get-all-zone-by-company',
      remove: 'zone/remove-zone',
      update: 'zone/update-zone-information',
    },
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * 'zone.run', 'zoneDelegate.invokeTask' for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
