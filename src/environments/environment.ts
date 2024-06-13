// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export class Environment  {
  production: boolean
  //API_URL: "https://backend.ez-marketing-us.com/"
  API_URL: string


  constructor(){
    this.production=true,
    //this.API_URL="http://localhost:8001/"
    this.API_URL="https://kanban365-backend.ez-marketing-us.com/"
  }
};

export const environment= new Environment()

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.