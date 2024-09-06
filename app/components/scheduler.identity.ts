/* eslint-disable @typescript-eslint/no-explicit-any */

interface ICustomIdentityRequestWrapper {
  accessToken?: string;
  grantId: string;
  email: string;
  provider: string;
  name?: string;
  domain?: string;
}

export class CustomIdentityRequestWrapperAccessToken {
  private accessToken: string | undefined;
  private grantId: string;
  private provider: string;
  private email: string;
  private name: string | undefined;
  private domain: string | undefined;

  constructor(config: ICustomIdentityRequestWrapper) {
    // Initialize the class
    this.accessToken = config.accessToken;
    this.grantId = config.grantId;
    this.provider = config.provider;
    this.name = config.name;
    this.email = config.email;
    this.domain = config.domain || "https://api.us.nylas.com/v3";
  }
  async request<T = any>(args: any): Promise<T> {
    try {
      const response = await fetch(`${this.domain}/grants/me/${args.path}`, {
        method: args.method,
        body: JSON.stringify(args.body),
        headers: {
          ...args.headers,
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the response is not okay (e.g., 404, 500)
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        return {
          error: `Error: ${response.status} ${response.statusText}`,
        } as any;
      }

      // Parse the response
      const data = await response.json();
      return [data, null] as any;
    } catch (error) {
      console.error("Fetch error:", error);
      return { error: "Error" } as any;
    }
  }

  /**
   * This method returns the current user's information.
   */

  async currentUser() {
    // IMPLEMENT: Get the logged in user's ID token and return the user information. For example,
    return {
      id: this.grantId,
      email: this.email,
      name: this.name,
      provider: this.provider,
    };
  }

  /**
   * This method sets the default authentication arguments to use when authenticating the user.
   */
  async setDefaultAuthArgs(authArgs: any) {
    // Set the default authentication arguments
    return authArgs;
  }

  /**
   * This method returns the URL to redirect the user to for authentication.
   */
  async authenticationUrl(): Promise<string | undefined> {
    // IMPLEMENT: Return the URL to redirect the user to for authentication. For example,
    return `${window.location.origin}/editor`;
  }
}

export class CustomIdentityRequestWrapperProxy {
  private grantId: string;
  private provider: string;
  private email: string;
  private name: string | undefined;
  private domain: string | undefined;

  constructor(config: ICustomIdentityRequestWrapper) {
    // Initialize the class
    this.grantId = config.grantId;
    this.provider = config.provider;
    this.name = config.name;
    this.email = config.email;
    //TODO Change this
    this.domain = "http://localhost:5173";
  }
  async request<T = any>(args: any): Promise<T> {
    try {
      const response = await fetch(`${this.domain}/scheduler/api`, {
        method: "POST",
        body: JSON.stringify({
          payload: args.body,
          path: args.path,
          grantId: this.grantId,
          method: args.method,
        }),
        headers: {
          ...args.headers,
          "Content-Type": "application/json",
        },
      });

      // Check if the response is not okay (e.g., 404, 500)
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        return {
          error: `Error: ${response.status} ${response.statusText}`,
        } as any;
      }

      // Parse the response
      const data = await response.json();
      console.log(data);
      return [data, null] as any;
    } catch (error) {
      console.error("Fetch error:", error);
      return { error: "Error" } as any;
    }
  }

  /**
   * This method returns the current user's information.
   */

  async currentUser() {
    // IMPLEMENT: Get the logged in user's ID token and return the user information. For example,
    return {
      id: this.grantId,
      email: this.email,
      name: this.name,
      provider: this.provider,
    };
  }

  /**
   * This method sets the default authentication arguments to use when authenticating the user.
   */
  async setDefaultAuthArgs(authArgs: any) {
    // Set the default authentication arguments
    return authArgs;
  }

  /**
   * This method returns the URL to redirect the user to for authentication.
   */
  async authenticationUrl(): Promise<string | undefined> {
    // IMPLEMENT: Return the URL to redirect the user to for authentication. For example,
    return `${window.location.origin}/editor`;
  }
}
