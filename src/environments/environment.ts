// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses 'environment.ts', but if you do
// 'ng build --env=prod' then 'environment.prod.ts' will be used instead.
// The list of which env maps to which file can be found in '.angular-cli.json'.

export const environment = {
  production: false,
  token: 'OEM_TOKEN',
  account: 'OEM_ACCOUNT',
  endPoint: 'http://localhost:8080/',
  // endPoint: 'http://113.161.84.125/',
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
      updateField: 'account/update/',
      changePassword: 'account/change-password'
    },
    assign: {
      assignTask: 'assign-task/',
    },
    search: {
      search: 'search-advance/'
    },
    beacon: {
      create: 'beacon/create',
      getAll: 'beacon/get-all',
      remove: 'beacon/remove/',
      update: 'beacon/update-dto/',
      updateField: 'beacon/update/',
      getByWorkplace: 'beacon/get-beacon-by-workplace',
      getAvailable: 'beacon/get-available-beacon',
      checkRemove: 'beacon/check-removable-beacon/',
    },
    notify: {
      getAll: 'notify/get-all/',
      send: 'notify/send',
      update: 'notify/update/'
    },
    employee: {
      create: 'employee/create',
      get: 'employee/get-by-manager',
      getAll: 'employee/get-all',
      remove: 'employee/remove/',
      update: 'employee/update-dto/',
      updateField: 'employee/update/',
      getById: 'employee/get-info',
      getByEmail: 'employee/get-info/email',
      getEmployeeByManager: 'employee/get-list-by-manager',
      getAvailableEmployee: 'employee/get-available-employee',
      getByRole: 'employee/get-list/by-role',
      getAllRole: `employee/get-all-role`,
      checkExist: 'account/check-exist-username',
      checkDuplicateId: 'employee/check-duplicate-id',
      checkEmployeeConstraint: 'employee/check-employee-constraint',
      getRemovedEmployee: 'employee/get-removed-employee',
      suggestion: 'suggestion/employee',
      checkMac: 'employee/check-phone-mac-address',
      checkAvailableForTask: 'employee/get-available-for-task'
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
      updateField: 'workplace/update/',
      addTask: 'workplace/add-task/',
      updateManager: 'workplace/update-manager/',
      getTaskBasic: 'workplace/get-task-basic/',
      getByManager: 'workplace/get-list-by-manager/',
      checkRemove: 'workplace/check-remove/',
      checkRemoveManager: 'workplace/check-remove-manager/',
      removeFromManager: 'workplace/remove-workplace-from-manager',
      addTaskToWorkplace: 'workplace/add-task-to-workplace',
      getAvailableByDate: 'workplace/get-available-workplace-and-task-by-date/',
      checkOverlap: 'workplace/check-overlap-for-task'
    },
    task: {
      create: 'task/create',
      getTaskDetail: 'task/get-task-detail',
      getTaskByDate: 'task/get-task-from-date-to-date',
      getTodayTask: 'task/get-today-task',
      remove: 'task/remove-task',
      summary: 'task/summary-task',
      update: 'task/update-task',
      updateWorkplace: 'task/update-workplace',
      updateField: 'task/update-task-by-field/',
      addTaskBasic: 'task/add-task-basic/',
      updateTaskBasicList: 'task/update-task-basic-list',
      getAssignHistory: 'assign-task/get-assign-history',
      checkRemove: 'task/check-task-basic',
      checkRemoveTaskBasic: 'task/check-remove-task-basic/',
      checkOverlap: 'task/check-overlap'
    },
    coordinate: {
      create: 'coordinate/create',
      update: 'coordinate/update',
    },
    report: {
      delete: 'report/delete-report/',
      getByTaskId: 'report/get-report/',
      submit: 'report/manager-submit-report',
      update: 'report/update',
    },
    taskBasic: {
      get: 'task/get-task-basic',
      getListBasic: 'task-basic/get-list-basic/',
      setToManager: 'task-basic/set-to-manager',
      remove: 'task-basic/remove-from-manager/',
    },
    schedule: {
      create: 'schedule/create',
      getAll: 'schedule/get-all',
      getDetail: 'schedule/get-detail/',
      updateField: 'schedule/update/',
      update: 'schedule/update-dto/',
      updateTaskBasic: 'schedule/update-task-basic/',
      deleteTaskBasic: 'schedule/remove-task-basic/',
      checkOverlap: 'schedule/check-overlap/',

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
      getByManager: 'company/get-all-company-by-manager/',
      checkRemove: 'company/check-remove/',

    },
    zone: {
      create: 'zone/add-zone',
      getByCompany: 'zone/get-all-zone-by-company',
      remove: 'zone/remove-zone',
      update: 'zone/update-zone-information',
      getByManager: 'zone/get-all-zone-by-manager/',
      checkRemove: 'zone/check-remove/',
    },
    calendar: {
      get: 'task/get-task-by-date-and-manager-id/'
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
