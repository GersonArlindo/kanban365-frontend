
export class Environment  {
  production: boolean;
  API_URL: string

  constructor(){
    this.production=true;
    //this.API_URL= "http://localhost:8001/"
    this.API_URL="https://kanban365-backend.ez-marketing-us.com/"
  }
  //API_URL: "https://backend.ez-marketing-us.com/"
}

export const environment=new Environment()
