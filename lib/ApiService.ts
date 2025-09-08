import axios, { type AxiosInstance } from 'axios';

class ApiService {
  private instance: AxiosInstance;
  private florentineToken: string;

  constructor({ florentineToken }: { florentineToken: string }) {
    this.florentineToken = florentineToken;
    this.instance = axios.create({
      baseURL: 'https://nltm.florentine.ai',
      headers: {
        'Content-Type': 'application/json',
        'florentine-token': this.florentineToken
      }
    });
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export default ApiService;
