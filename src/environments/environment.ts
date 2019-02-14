// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  endPoint: 'http://localhost:8080/',
  apiPaths: {
    admin: {
      beacon: {
        create: 'admin/beacon/create',
        getAll: 'admin/beacon/getAll',
        remove: 'admin/beacon/remove/',
        update: 'admin/beacon/update/',
      },
      employee: {
        create: 'admin/employee/create',
        get: 'admin/employee/get-by-manager',
        getAll: 'admin/employee/getAll',
        remove: `admin/employee/remove/{id}?id=`,
        update: 'admin/employee/update/',
      },
      workplace: {
        create: 'admin/workplace/create',
        getAll: 'admin/workplace/getAll',
        remove: 'admin/workplace/remove/',
        update: 'admin/workplace/update/',
      }
    }
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
