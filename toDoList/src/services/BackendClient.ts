export abstract class BackendClient {
	protected baseUrl: string;
  
	constructor(basePath: string) {
	  this.baseUrl = `http://localhost:3000/${basePath}`;
	}
  }
  