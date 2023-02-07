
export class BaseClass {
  protected token: String = ""; // your custom logic to get the token

  public setToken(token: string) {
    this.token = token;
  }

  protected transformOptions = async (options: RequestInit): Promise<RequestInit> => {
    options.headers = {
      ...options.headers,
      Authorization: 'Bearer ' + this.token,
    };
    return Promise.resolve(options);
  };
}